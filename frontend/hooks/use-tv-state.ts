"use client"

import { useState, useCallback } from "react"
import type { TVState, Item } from "@/types"

export function useTVState() {
  const [state, setState] = useState<TVState>("off")
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  const turnOn = useCallback(() => {
    setState("on")
  }, [])

  const turnOff = useCallback(() => {
    setState("off")
    setSelectedItem(null)
  }, [])

  const activate = useCallback(() => {
    if (state === "on") {
      setState("active")
      setSelectedItem(null)
    }
  }, [state])

  const togglePower = useCallback(() => {
    if (state === "off") {
      turnOn()
    } else {
      turnOff()
    }
  }, [state, turnOn, turnOff])

  const selectItem = useCallback(
    (item: Item) => {
      if (state === "active") {
        setSelectedItem(item)
      }
    },
    [state],
  )

  return {
    state,
    selectedItem,
    turnOn,
    turnOff,
    activate,
    togglePower,
    selectItem,
  }
}

