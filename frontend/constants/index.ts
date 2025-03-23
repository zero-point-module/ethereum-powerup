/**
 * Main constants file that re-exports all constants
 * from domain-specific files for convenient imports
 */

// Re-export all constants from domain-specific files
export * from './modules';
export * from './ui';

// Grouped storage keys
export const STORAGE_KEYS = {
  INSTALLED_MODULES: 'installedModules',
};
