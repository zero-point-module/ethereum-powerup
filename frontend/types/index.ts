import type React from "react"
// Define our interface states
export type TVState = "off" | "on" | "active"

// Define our list items
export interface Item {
  id: number
  title: string
  description?: string
}

// Component props types
export interface CircularDisplayProps {
  state: TVState
}

export interface ListDisplayProps {
  items: Item[]
  state: TVState
  selectedItem: Item | null
  onSelectItem: (item: Item) => void
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

