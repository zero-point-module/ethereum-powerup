'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { STORAGE_KEY } from '@/constants/modules';

// Define the modules store state and actions
interface ModulesStore {
  // State
  installedModules: number[];

  // Actions
  installModule: (moduleId: number) => void;
  uninstallModule: (moduleId: number) => void;
  isModuleInstalled: (moduleId: number) => boolean;
  clearAllModules: () => void;
}

// Create the modules store with persistence
export const useModulesStore = create<ModulesStore>()(
  persist(
    (set, get) => ({
      // Initial state
      installedModules: [],

      // Actions
      installModule: (moduleId: number) => {
        const { installedModules } = get();
        if (!installedModules.includes(moduleId)) {
          set({ installedModules: [...installedModules, moduleId] });
        }
      },

      uninstallModule: (moduleId: number) => {
        set({
          installedModules: get().installedModules.filter(
            (id) => id !== moduleId
          ),
        });
      },

      isModuleInstalled: (moduleId: number) => {
        return get().installedModules.includes(moduleId);
      },

      clearAllModules: () => {
        set({ installedModules: [] });
      },
    }),
    {
      name: STORAGE_KEY, // Storage key for persistence
    }
  )
);
