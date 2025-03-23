'use client';

import { useState, useCallback } from 'react';
import type { TVState, Item } from '@/types';

/**
 * Custom hook to manage the TV interface state
 * Handles state transitions, power control, and item selection
 */
export function useTVState() {
  // Main TV state - (off → on → active)
  const [state, setState] = useState<TVState>('off');

  // Currently selected module item
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  /**
   * Turn the TV on - transitions from 'off' to 'on' state
   */
  const turnOn = useCallback(() => {
    setState('on');
  }, []);

  /**
   * Turn the TV off - resets to initial state and clears selection
   */
  const turnOff = useCallback(() => {
    setState('off');
    setSelectedItem(null);
  }, []);

  /**
   * Activate the TV - transitions from 'on' to 'active' state
   * Only works when TV is already in 'on' state
   */
  const activate = useCallback(() => {
    if (state === 'on') {
      setState('active');
      setSelectedItem(null);
    }
  }, [state]);

  /**
   * Toggle power - switches between 'off' and last active state
   */
  const togglePower = useCallback(() => {
    if (state === 'off') {
      turnOn();
    } else {
      turnOff();
    }
  }, [state, turnOn, turnOff]);

  /**
   * Select a module item - only works in 'active' state
   */
  const selectItem = useCallback(
    (item: Item) => {
      if (state === 'active') {
        setSelectedItem(item);
      }
    },
    [state]
  );

  return {
    state,
    selectedItem,
    turnOn,
    turnOff,
    activate,
    togglePower,
    selectItem,
  };
}
