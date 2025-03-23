'use client';

import { create } from 'zustand';
import type { TVState, Item } from '@/types';

// Define the TV store state and actions
interface TVStore {
  // State
  state: TVState;
  selectedItem: Item | null;

  // Actions
  turnOn: () => void;
  turnOff: () => void;
  activate: () => void;
  togglePower: () => void;
  selectItem: (item: Item) => void;
  clearSelection: () => void;
}

// Create the TV store
export const useTVStore = create<TVStore>((set, get) => ({
  // Initial state
  state: 'off',
  selectedItem: null,

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
}));
