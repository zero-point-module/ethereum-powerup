import type React from 'react';
// Define our interface states
export type TVState = 'off' | 'on' | 'active';

// Define button variants
export type ButtonVariant = 'default' | 'power-up' | 'install' | 'uninstall';

// Define our list items
export interface Item {
  id: string;
  name: string;
  description: string;
  contractAddress: string;
}

// Component props types
export interface CircularDisplayProps {
  state: TVState;
}

export interface ListDisplayProps {
  items: Item[];
  state: TVState;
  selectedItem: Item | null;
  onSelectItem: (item: Item) => void;
}

export interface DetailScreenProps {
  state: TVState;
  selectedItem: Item | null;
  isWorkbenchActive?: boolean;
}

export interface ActionButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  tvState?: TVState;
  variant?: ButtonVariant;
  isWorkbenchActive?: boolean;
  isLoading?: boolean;
  onWorkbenchClick?: () => void;
}

export interface TVFrameProps {
  children: React.ReactNode;
  onPowerClick: () => void;
  isPowered: boolean;
}
