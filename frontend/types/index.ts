import type React from "react"
// Define our interface states
export type TVState = "off" | "on" | "active"

export type Module = {
  id: string;
  name: string;
  description: string;
  contractAddress: string;
}

// Component props types
export interface CircularDisplayProps {
  state: TVState
}

export interface ListDisplayProps {
  items: Module[]
  state: TVState
  selectedItem: Module | null
  onSelectItem: (item: Module) => void
}

export interface DetailScreenProps {
  state: TVState
  selectedItem: Item | null
}

export interface ActionButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  className?: string
  tvState?: TVState
}

export interface TVFrameProps {
  children: React.ReactNode
  onPowerClick: () => void
  isPowered: boolean
}

