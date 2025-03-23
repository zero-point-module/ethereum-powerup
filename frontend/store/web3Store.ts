import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Module } from '../types/modules';

interface Web3State {
  // Connection state
  address: string | null;
  chainId: number | null;
  isConnecting: boolean;
  error: Error | null;

  // EOA state
  isUpgraded: boolean;
  delegatedAddress: string | null;
  installedModules: Module[];
}

interface Web3Actions {
  // Connection actions
  setAddress: (address: string | null) => void;
  setChainId: (chainId: number | null) => void;
  setIsConnecting: (isConnecting: boolean) => void;
  setError: (error: Error | null) => void;

  // EOA actions
  setIsUpgraded: (isUpgraded: boolean) => void;
  setDelegatedAddress: (address: string | null) => void;
  setInstalledModules: (modules: Module[]) => void;
  addModule: (module: Module) => void;
  removeModule: (moduleId: string) => void;
  clearModules: () => void;

  // General actions
  reset: () => void;
}

type Store = Web3State & Web3Actions;

const initialState: Web3State = {
  // Connection initial state
  address: null,
  chainId: null,
  isConnecting: false,
  error: null,

  // EOA initial state
  isUpgraded: false,
  delegatedAddress: null,
  installedModules: [],
};

export const useWeb3Store = create<Store>()(
  persist(
    (set) => ({
      ...initialState,

      // Connection actions
      setAddress: (address) => set({ address }),
      setChainId: (chainId) => set({ chainId }),
      setIsConnecting: (isConnecting) => set({ isConnecting }),
      setError: (error) => set({ error }),

      // EOA actions
      setIsUpgraded: (isUpgraded) => set({ isUpgraded }),
      setDelegatedAddress: (address) => set({ delegatedAddress: address }),
      setInstalledModules: (modules) => set({ installedModules: modules }),
      addModule: (module) => 
        set((state) => ({
          installedModules: state.installedModules.some(m => m.id === module.id)
            ? state.installedModules
            : [...state.installedModules, module]
        })),
      removeModule: (moduleId) =>
        set((state) => ({
          installedModules: state.installedModules.filter(m => m.id !== moduleId)
        })),
      clearModules: () => set({ installedModules: [] }),

      // General actions
      reset: () => set(initialState),
    }),
    {
      name: 'web3-storage',
      partialize: (state) => ({
        installedModules: state.installedModules,
        isUpgraded: state.isUpgraded,
        delegatedAddress: state.delegatedAddress,
      }),
    }
  )
); 