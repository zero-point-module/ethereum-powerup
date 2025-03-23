'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import { STORAGE_KEY } from '@/constants/modules';

// Define the context interface with available methods
interface InstalledModulesContextType {
  installedModules: number[];
  installModule: (moduleId: number) => void;
  uninstallModule: (moduleId: number) => void;
  isModuleInstalled: (moduleId: number) => boolean;
  clearAllModules: () => void;
}

// Create the context with undefined default value
const InstalledModulesContext = createContext<
  InstalledModulesContextType | undefined
>(undefined);

/**
 * Provider component that wraps the application and manages installed modules
 * Handles persistence to localStorage and provides module management functions
 */
export function InstalledModulesProvider({
  children,
}: {
  children: ReactNode;
}) {
  // State to track installed module IDs
  const [installedModules, setInstalledModules] = useState<number[]>([]);

  // Load installed modules from localStorage on initial render
  useEffect(() => {
    try {
      const savedModules = localStorage.getItem(STORAGE_KEY);
      if (savedModules) {
        setInstalledModules(JSON.parse(savedModules));
      }
    } catch (error) {
      console.error('Failed to load installed modules:', error);
    }
  }, []);

  // Save installed modules to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(installedModules));
    } catch (error) {
      console.error('Failed to save installed modules:', error);
    }
  }, [installedModules]);

  /**
   * Install a module if not already installed
   */
  const installModule = useCallback(
    (moduleId: number) => {
      if (!installedModules.includes(moduleId)) {
        setInstalledModules((prev) => [...prev, moduleId]);
      }
    },
    [installedModules]
  );

  /**
   * Uninstall a module by removing it from the installed list
   */
  const uninstallModule = useCallback((moduleId: number) => {
    setInstalledModules((prev) => prev.filter((id) => id !== moduleId));
  }, []);

  /**
   * Check if a module is installed
   */
  const isModuleInstalled = useCallback(
    (moduleId: number) => {
      return installedModules.includes(moduleId);
    },
    [installedModules]
  );

  /**
   * Clear all installed modules
   */
  const clearAllModules = useCallback(() => {
    setInstalledModules([]);
  }, []);

  // Create context value object
  const value = {
    installedModules,
    installModule,
    uninstallModule,
    isModuleInstalled,
    clearAllModules,
  };

  return (
    <InstalledModulesContext.Provider value={value}>
      {children}
    </InstalledModulesContext.Provider>
  );
}

/**
 * Custom hook to use the installed modules context
 * Throws an error if used outside of a provider
 */
export function useInstalledModules() {
  const context = useContext(InstalledModulesContext);
  if (context === undefined) {
    throw new Error(
      'useInstalledModules must be used within an InstalledModulesProvider'
    );
  }
  return context;
}
