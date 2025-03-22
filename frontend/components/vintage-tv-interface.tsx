"use client"

import { useState, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { Group } from "three"
import CircularDisplay from "./circular-display"
import ListDisplay from "./list-display"
import DetailScreen from "./detail-screen"
import ActionButton from "./action-button"
import { TVFrame } from "./tv-frame"

export type Item = {
  id: number
  title: string
  description: string
  status: "active" | "inactive" | "warning"
}

const ITEMS: Item[] = [
  {
    id: 1,
    title: "Social Recovery",
    description: "Restore access to your vault using trusted contacts.",
    status: "active",
  },
  { id: 2, title: "System Diagnostics", description: "Run a full system check on all components.", status: "active" },
  {
    id: 3,
    title: "Radio Transmitter",
    description: "Broadcast emergency signals to nearby stations.",
    status: "warning",
  },
  { id: 4, title: "Inventory Manager", description: "Check and organize your collected items.", status: "active" },
]

export default function VintageTVInterface() {
  const [isOn, setIsOn] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const groupRef = useRef<Group>(null)

  const togglePower = () => {
    setIsOn(!isOn)
    if (!isOn) {
      // When turning on, don't select an item immediately
      setSelectedItem(null)
    }
  }

  const selectItem = (item: Item) => {
    if (isOn) {
      setSelectedItem(item)
    }
  }

  // Add some gentle floating movement
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.05
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.05
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <TVFrame>
        <group position={[-1.5, 0, 0.1]}>
          <CircularDisplay isOn={isOn} />
          <ListDisplay
            items={ITEMS}
            isOn={isOn}
            selectedItem={selectedItem}
            onSelectItem={selectItem}
            position={[0, -1.2, 0]}
          />
          <ActionButton label={isOn ? "POWER OFF" : "START"} onClick={togglePower} position={[0, -2.5, 0]} />
        </group>

        <group position={[1.5, 0, 0.1]}>
          <DetailScreen isOn={isOn} selectedItem={selectedItem} />
        </group>
      </TVFrame>
    </group>
  )
}

