import { 
  JsonRpcSigner, 
  BrowserProvider, 
  TransactionRequest, 
  Authorization as EthersAuthorization,
  BigNumberish,
  Addressable,
  TypedDataDomain,
  TypedDataField,
  toBeHex,
  resolveAddress,
  toBigInt,
  hashAuthorization,
  TypedDataEncoder,
  getAddress,
  getBigInt,
  Signature
} from 'ethers';
import { useWeb3Store } from '../stores/web3Store';
import { RelayerTransactionRequest } from './relayer';

export interface EIP7702Authorization {
  address: string | Addressable;
  type?: number;
  nonce: BigNumberish;
  chainId: BigNumberish;
  signature: string;
}

export interface EIP7702TransactionRequest extends Omit<TransactionRequest, 'type' | 'authorizationList'> {
  type: 4;
  authorizationList: EIP7702Authorization[];
}

export class EIP7702Signer extends JsonRpcSigner {
  constructor(provider: BrowserProvider, address: string) {
    super(provider, address);
  }

  private async checkEIP7702Support(): Promise<boolean> {
    try {
      // Try to get the latest block to check the network version
      const block = await this.provider.getBlock('latest');
      if (!block) return false;

      // Check if the block timestamp is after the Pectra upgrade (estimated)
      // This is a temporary check until we have proper network support
      const pectraTimestamp = new Date('2024-03-01').getTime() / 1000;
      return block.timestamp >= pectraTimestamp;
    } catch (error) {
      console.warn('Failed to check EIP-7702 support:', error);
      return false;
    }
  }

  override async authorize(auth: { address: string | Addressable }): Promise<EthersAuthorization> {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    const network = await this.provider.getNetwork();
    const signerAddress = await this.getAddress();
    const nonce = Date.now(); // Using timestamp as nonce for simplicity

    // Create authorization request
    const authRequest = {
      address: await resolveAddress(auth.address),
      nonce: BigInt(nonce),
      chainId: network.chainId,
    };

    // Hash the authorization data
    const messageHash = hashAuthorization(authRequest);

    // Sign the hash using personal_sign
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      // personal_sign expects message first, then address
      params: [messageHash, signerAddress]
    });

    // Split signature into r, s, v components
    const sig = signature.slice(2); // remove 0x
    const r = '0x' + sig.slice(0, 64);
    const s = '0x' + sig.slice(64, 128);
    const v = parseInt(sig.slice(128, 130), 16);

    // Create proper Signature object
    const canonicalSignature = Signature.from({
      r: r.replace(/^0x0+/, '0x'),
      s: s.replace(/^0x0+/, '0x'),
      v
    });

    // Return the authorization with signature
    return {
      address: getAddress(authRequest.address),
      nonce: getBigInt(authRequest.nonce),
      chainId: getBigInt(authRequest.chainId),
      signature: canonicalSignature,
    };
  }

  override async sendTransaction(
    transaction: TransactionRequest | EIP7702TransactionRequest
  ): Promise<any> {
    const isType4 = (type: TransactionRequest['type']): boolean => {
      if (typeof type === 'number') return type === 4;
      if (typeof type === 'string') return type === '4' || type === '0x4';
      return false;
    };

    // If it's a type 4 transaction with authorizations, check support
    if (
      'type' in transaction &&
      isType4(transaction.type) &&
      'authorizationList' in transaction &&
      transaction.authorizationList
    ) {
      const isSupported = await this.checkEIP7702Support();
      if (!isSupported) {
        throw new Error(
          'EIP-7702 is not yet supported on this network. ' +
          'Please wait for the Pectra upgrade or use a local testnet.'
        );
      }

      const relayer = useWeb3Store.getState().relayer;
      if (!relayer) {
        throw new Error('Relayer not initialized');
      }

      const network = await this.provider.getNetwork();
      
      // Get fee data with proper fallbacks
      const feeData = await this.provider.getFeeData();
      const maxFeePerGas = toBeHex(
        transaction.maxFeePerGas || 
        feeData.maxFeePerGas || 
        toBigInt('0x' + (2n * 10n ** 9n).toString(16)) // 2 gwei default
      );
      const maxPriorityFeePerGas = toBeHex(
        transaction.maxPriorityFeePerGas || 
        feeData.maxPriorityFeePerGas ||
        toBigInt('0x' + (1n * 10n ** 9n).toString(16)) // 1 gwei default
      );
      
      // Format transaction according to EIP-7702
      const formattedTx = {
        type: 4,
        to: transaction.to ? await resolveAddress(transaction.to) : null,
        value: toBeHex(transaction.value || 0),
        gasLimit: toBeHex(transaction.gasLimit || '0x100000'),
        maxFeePerGas,
        maxPriorityFeePerGas,
        data: transaction.data || '0x',
        authorizationList: await Promise.all(transaction.authorizationList.map(async auth => {
          const address = await resolveAddress(auth.address);
          const nonce = toBeHex(auth.nonce || 0).replace(/^0x0+/, '0x');
          const chainId = toBeHex(auth.chainId || network.chainId).replace(/^0x0+/, '0x');
          const signature = (typeof auth.signature === 'string' ? auth.signature : '0x')
            .replace(/^0x0+/, '0x'); // Remove leading zeros

          return {
            address,
            nonce,
            chainId,
            signature,
          };
        })),
      } as RelayerTransactionRequest;

      console.log('Formatted transaction:', formattedTx);

      try {
        return await relayer.sendTransaction(formattedTx);
      } catch (error) {
        console.error('EIP7702Signer error:', error);
        if (error instanceof Error && error.message.includes('Unable to perform request')) {
          throw new Error(
            'Network does not support EIP-7702 transactions yet. ' +
            'Please wait for the Pectra upgrade or use a local testnet.'
          );
        }
        throw error;
      }
    }
    
    // Otherwise, use the default implementation
    return await super.sendTransaction(transaction as TransactionRequest);
  }
} 