import type { Item } from '@/types';

/**
 * Default modules available in the TV interface
 */
export const DEFAULT_MODULES: Item[] = [
  {
    id: 1,
    title: 'Social Recovery',
    description: 'Restore access to your vault using trusted contacts.',
  },
  {
    id: 2,
    title: 'System Diagnostics',
    description: 'Run a full system check on all components.',
  },
  {
    id: 3,
    title: 'Radio Transmitter',
    description: 'Broadcast emergency signals to nearby stations.',
  },
  {
    id: 4,
    title: 'Inventory Manager',
    description: 'Check and organize your collected items.',
  },
];

/**
 * Local storage key for installed modules
 */
export const STORAGE_KEY = 'installedModules';
