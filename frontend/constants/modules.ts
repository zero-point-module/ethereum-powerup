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
    id: 'system-diagnostics',
    name: 'System Diagnostics',
    description: 'Run a full system check on all components.',
    contractAddress: '0x0000000000000000000000000000000000000000',
  },
  {
    id: 'radio-transmitter',
    name: 'Radio Transmitter',
    description: 'Broadcast emergency signals to nearby stations.',
    contractAddress: '0x0000000000000000000000000000000000000000',
  },
  {
    id: 'inventory-manager',
    name: 'Inventory Manager',
    description: 'Check and organize your collected items.',
    contractAddress: '0x0000000000000000000000000000000000000000',
  },
];
