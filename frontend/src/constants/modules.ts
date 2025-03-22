export interface Module {
  id: string;
  name: string;
  description: string;
  contractAddress: string;
}

export const AVAILABLE_MODULES: Module[] = [
  {
    id: 'erc20-batch',
    name: 'ERC20 Batch Transfer',
    description: 'Enables batch transfer of ERC20 tokens in a single transaction',
    contractAddress: '0x...' // You'll need to deploy and add the actual contract address
  },
  {
    id: 'auto-swap',
    name: 'Auto Swap',
    description: 'Automatically swap tokens based on predefined rules',
    contractAddress: '0x...' // You'll need to deploy and add the actual contract address
  },
  {
    id: 'recurring-payments',
    name: 'Recurring Payments',
    description: 'Set up automated recurring payments',
    contractAddress: '0x...' // You'll need to deploy and add the actual contract address
  }
]; 