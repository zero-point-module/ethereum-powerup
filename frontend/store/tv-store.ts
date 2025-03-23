'use client';

import { create } from 'zustand';
import type { TVState, Item } from '@/types';
import { useWeb3Store } from '../store/web3Store';
import { SEPOLIA_CHAIN_ID } from '../hooks/eoa/constants';

// Define the TV store state and actions
interface TVStore {
  // State
  state: TVState;
  selectedItem: Item | null;
  isInitialized: boolean;

  // Actions
  turnOn: () => void;
  turnOff: () => void;
  activate: () => void;
  togglePower: () => void;
  selectItem: (item: Item) => void;
  clearSelection: () => void;
  initializeFromWallet: () => Promise<void>;
}

// Create the TV store
export const useTVStore = create<TVStore>((set, get) => ({
  // Initial state
  state: 'off',
  selectedItem: null,
  isInitialized: false,

  // Actions
  turnOn: () => set({ state: 'on' }),

  turnOff: () => set({ state: 'off', selectedItem: null }),

  activate: () => {
    const { state } = get();
    if (state === 'on') {
      set({ state: 'active', selectedItem: null });
    }
  },

  togglePower: () => {
    const { state, turnOn, turnOff } = get();
    if (state === 'off') {
      turnOn();
    } else {
      turnOff();
    }
  },

  selectItem: (item: Item) => {
    const { state, selectedItem } = get();
    if (state === 'active') {
      // If the item is already selected, deselect it
      if (selectedItem && selectedItem.id === item.id) {
        set({ selectedItem: null });
      } else {
        // Otherwise select the new item
        set({ selectedItem: item });
      }
    }
  },

  clearSelection: () => {
    const { state } = get();
    if (state === 'active') {
      set({ selectedItem: null });
    }
  },

  // Initialize TV state based on wallet upgrade status
  initializeFromWallet: async () => {
    try {
      // Get Web3 store and check if connected
      const web3Store = useWeb3Store.getState();
      const { provider, address, chainId, isUpgraded, isConnected } = web3Store;

      // Default to off if not connected
      if (!isConnected || !provider || !address) {
        set({ state: 'off', isInitialized: true });
        return;
      }

      // Check if on correct network (Sepolia)
      const isSepoliaNetwork = chainId === SEPOLIA_CHAIN_ID;
      if (!isSepoliaNetwork) {
        set({ state: 'off', isInitialized: true });
        return;
      }

      // Check EOA status directly from provider
      const code = await provider.getCode(address);
      const hasPoweredUp = code !== '0x';
      
      console.log('TV Store - Wallet status:', { 
        address,
        hasPoweredUp,
        isUpgraded: web3Store.isUpgraded,
        codeLength: code.length
      });
      
      // Set TV state based on upgrade status
      if (hasPoweredUp || isUpgraded) {
        // Wallet is upgraded, turn TV on and activate
        set({ state: 'active', isInitialized: true });
      } else {
        // Wallet is connected but not upgraded, just turn on
        set({ state: 'on', isInitialized: true });
      }
    } catch (error) {
      console.error('Failed to initialize TV from wallet:', error);
      // Default to off on error
      set({ state: 'off', isInitialized: true });
    }
  },
}));
