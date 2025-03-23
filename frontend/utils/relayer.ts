import { Wallet, JsonRpcProvider, TransactionRequest, toBeHex, toBigInt } from 'ethers';

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
    this.provider = new JsonRpcProvider(rpcUrl);
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
    // Wait for provider to be ready
    await this.waitForProvider();

    // Get the nonce for the transaction
    const nonce = await this.wallet.getNonce();

    // Get current network
    const network = await this.provider.getNetwork();

    // Format transaction for EIP-7702
    const formattedTx: TransactionRequest = {
      type: 4,
      to: tx.to,
      value: this.toBigIntFromHex(tx.value),
      gasLimit: this.toBigIntFromHex(tx.gasLimit || '0x100000'),
      maxFeePerGas: this.toBigIntFromHex(tx.maxFeePerGas),
      maxPriorityFeePerGas: this.toBigIntFromHex(tx.maxPriorityFeePerGas),
      nonce,
      data: tx.data || '0x',
      // Format authorization list
      authorizationList: tx.authorizationList?.map(auth => ({
        ...auth,
        nonce: this.toCanonicalHex(auth.nonce),
        chainId: this.toCanonicalHex(auth.chainId || network.chainId),
      })),
    };

    console.log('Sending formatted transaction:', formattedTx);

    try {
      // Send the transaction
      const response = await this.wallet.sendTransaction(formattedTx);
      console.log('Transaction sent:', response.hash);
      return response;
    } catch (error) {
      console.error('Relayer error:', error);
      // Check if it's a provider error
      if (error instanceof Error && error.message.includes('Unable to perform request')) {
        throw new Error('Failed to send transaction through relayer. Please try again.');
      }
      throw error;
    }
  }
} 