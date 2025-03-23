import { Wallet, JsonRpcProvider, TransactionRequest, toBeHex, toBigInt, Signature, Transaction, Authorization, hexlify, getBytes, keccak256, concat } from 'ethers';

// Custom type for EIP-7702 authorization array
type EIP7702Authorization = [bigint, string, bigint, number, string, string]; // [chain_id, address, nonce, y_parity, r, s]

// Custom type for EIP-7702 transaction
interface EIP7702TransactionRequest extends Omit<TransactionRequest, 'type' | 'authorizationList'> {
  type: 4;
  authorizationList?: EIP7702Authorization[];
}

export interface RelayerTransactionRequest extends Omit<TransactionRequest, 'type'> {
  type?: number | string;
  authorizationList?: Array<{
    address: string;
    nonce: string;
    chainId: string;
    signature: string;
  }>;
}

export class Relayer {
  private wallet: Wallet;
  private provider: JsonRpcProvider;
  
  constructor(privateKey: string, rpcUrl: string) {
    // Ensure we're using a proper JsonRpcProvider with all methods
    this.provider = new JsonRpcProvider(rpcUrl, undefined, {
      staticNetwork: null,
      batchMaxCount: 1
    });
    this.wallet = new Wallet(privateKey, this.provider);
  }

  async getAddress(): Promise<string> {
    return await this.wallet.getAddress();
  }

  private toCanonicalHex(value: string | number | bigint | null | undefined): string {
    if (value === null || value === undefined) return '0x0';
    const hex = typeof value === 'string' ? value : toBeHex(value);
    // Remove leading zeros after 0x and handle empty string
    const stripped = hex.slice(2).replace(/^0+/, '');
    return '0x' + (stripped || '0');
  }

  private toBigIntFromHex(value: string | number | bigint | null | undefined): bigint {
    if (value === null || value === undefined || value === '0x') return 0n;
    if (typeof value === 'bigint') return value;
    if (typeof value === 'number') return BigInt(value);
    // Handle hex strings
    const hex = this.toCanonicalHex(value);
    return toBigInt(hex);
  }

  private async waitForProvider(): Promise<void> {
    let retries = 3;
    while (retries > 0) {
      try {
        await this.provider.getNetwork();
        return;
      } catch (error) {
        console.warn('Provider not ready, retrying...', error);
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  async sendTransaction(tx: RelayerTransactionRequest): Promise<any> {
    console.log('Relayer sending transaction:', tx);
    
    try {
      // Wait for provider to be ready
      await this.waitForProvider();

      // Get the nonce for the transaction directly from the provider
      const address = await this.wallet.getAddress();
      const nonce = await this.provider.getTransactionCount(address);
      console.log('Relayer nonce:', nonce);

      // Get current network
      const network = await this.provider.getNetwork();
      console.log('Network chainId:', network.chainId.toString());

      // Get fee data with proper fallbacks
      const feeData = await this.provider.getFeeData();
      const maxFeePerGas = this.toBigIntFromHex(
        tx.maxFeePerGas || 
        feeData.maxFeePerGas || 
        '0x' + (2n * 10n ** 9n).toString(16) // 2 gwei default
      );
      const maxPriorityFeePerGas = this.toBigIntFromHex(
        tx.maxPriorityFeePerGas || 
        feeData.maxPriorityFeePerGas ||
        '0x' + (1n * 10n ** 9n).toString(16) // 1 gwei default
      );

      // Check if destination address is valid
      if (!tx.to) {
        throw new Error('Destination address is required for EIP-7702 transactions');
      }

      // Convert auth list to the correct format for EIP-7702
      console.log('Original Authorization list:', tx.authorizationList);
      
      // Process authorizations
      const processedAuths = tx.authorizationList?.map(auth => {
        const sig = Signature.from(auth.signature);
        console.log('Processing auth for address:', auth.address);
        console.log('Signature components:', {
          v: sig.yParity,
          r: sig.r,
          s: sig.s
        });
        
        return {
          address: auth.address,
          nonce: this.toBigIntFromHex(auth.nonce),
          chainId: this.toBigIntFromHex(auth.chainId || network.chainId),
          signature: sig
        } as Authorization;
      });
      
      // Format transaction for EIP-7702
      // Note: Using the ethers.js Transaction class for proper encoding
      const rawTx = {
        type: 4,
        chainId: network.chainId,
        nonce,
        maxPriorityFeePerGas,
        maxFeePerGas,
        gasLimit: this.toBigIntFromHex(tx.gasLimit || '0x1000000'),
        to: typeof tx.to === 'string' ? tx.to : String(tx.to), // Ensure string type
        value: this.toBigIntFromHex(tx.value || 0),
        data: tx.data || '0x',
        authorizationList: processedAuths
      };

      console.log('Raw transaction:', JSON.stringify(rawTx, (_, v) => 
        typeof v === 'bigint' ? v.toString() : v
      ));

      // Create the transaction manually with a specific workflow to bypass getNonce issues
      const populatedTx = await this.wallet.populateTransaction({
        ...rawTx,
        nonce,
        gasLimit: BigInt(tx.gasLimit || 1000000),
      });
      
      console.log('Populated transaction:', populatedTx);
      
      // Sign the transaction manually
      const signedTx = await this.wallet.signTransaction(populatedTx);
      console.log('Signed transaction hex:', signedTx);
      
      // Send the raw transaction
      const response = await this.provider.send('eth_sendRawTransaction', [signedTx]);
      console.log('Transaction sent:', response);
      return {
        hash: response,
        wait: async () => {
          console.log('Waiting for transaction confirmation...');
          const receipt = await this.provider.waitForTransaction(response);
          console.log('Transaction confirmed, receipt:', receipt);
          return receipt;
        }
      };
    } catch (error) {
      console.error('Relayer error:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        if (error.message.includes('Unable to perform request')) {
          throw new Error('Failed to send transaction through relayer. Please try again.');
        }
      }
      throw error;
    }
  }
} 