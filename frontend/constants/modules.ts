import type { Item } from '@/types';

/**
 * Default modules available in the TV interface
 */
export const DEFAULT_MODULES: Item[] = [
  {
    id: 'social-recovery',
    name: 'Social Recovery',
    description: 'Restore access to your vault using trusted contacts.',
    contractAddress: '0x0000000000000000000000000000000000000000',
  },
  {
    id: 'spending-limit',
    name: 'Spending Limits',
    description: 'Set a limit on the amount of ether that can be spent in a particular timeframe.',
    contractAddress: '0x0000000000000000000000000000000000000000',
  },
  {
    id: 'auto-savings',
    name: 'Auto Savings',
    description: 'Automatically save a percentage of your transactions to a savings account.',
    contractAddress: '0x0000000000000000000000000000000000000000',
  },
  {
    id: 'minimal-batch-executor',
    name: 'Min. Batch Executor',
    description: 'Execute multiple transactions in a single call.',
    contractAddress: '0x0000000000000000000000000000000000000000',
  },
];

/**
 * Local storage key for installed modules
 */
export const STORAGE_KEY = 'installedModules';
