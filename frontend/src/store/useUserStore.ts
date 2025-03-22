import { create } from 'zustand';
import type { Module } from '../constants/modules';

interface UserState {
  address: string | null;
  isUpgraded: boolean;
  installedModules: Module[];
  setAddress: (address: string | null) => void;
  setIsUpgraded: (isUpgraded: boolean) => void;
  setInstalledModules: (modules: Module[]) => void;
  reset: () => void;
}

const initialState = {
  address: null,
  isUpgraded: false,
  installedModules: [],
};

export const useUserStore = create<UserState>((set) => ({
  ...initialState,
  setAddress: (address) => set({ address }),
  setIsUpgraded: (isUpgraded) => set({ isUpgraded }),
  setInstalledModules: (installedModules) => set({ installedModules }),
  reset: () => set(initialState),
})); 