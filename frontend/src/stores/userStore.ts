import { create } from 'zustand';
import type { Module } from '../constants/modules';

interface UserState {
  address: string | null;
  isUpgraded: boolean;
  installedModules: Module[];
  isConnecting: boolean;
  error: string | null;
  setAddress: (address: string | null) => void;
  setIsUpgraded: (isUpgraded: boolean) => void;
  setInstalledModules: (modules: Module[]) => void;
  setIsConnecting: (isConnecting: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  address: null,
  isUpgraded: false,
  installedModules: [],
  isConnecting: false,
  error: null,
};

export const useUserStore = create<UserState>((set) => ({
  ...initialState,
  
  setAddress: (address) => set({ address }),
  
  setIsUpgraded: (isUpgraded) => set({ isUpgraded }),
  
  setInstalledModules: (modules) => set({ installedModules: modules }),
  
  setIsConnecting: (isConnecting) => set({ isConnecting }),
  
  setError: (error) => set({ error }),
  
  reset: () => set(initialState),
})); 