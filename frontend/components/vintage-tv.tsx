"use client"

import { useMemo } from "react"
import { TVFrame } from "./tv-frame"
import { CircularDisplay } from "./circular-display"
import { ListDisplay } from "./list-display"
import { DetailScreen } from "./detail-screen"
import { ActionButton } from "./action-button"
import { useInstalledModules } from "@/contexts/installed-modules-context"
import { useTVState } from "@/hooks/use-tv-state"
import { DEFAULT_ITEMS } from "@/constants"

export default function VintageTV() {
  const { state, selectedItem, turnOn, activate, togglePower, selectItem } = useTVState()

  const { isModuleInstalled, installModule } = useInstalledModules()

  // Handle install action
  const handleInstall = () => {
    if (selectedItem && !isModuleInstalled(selectedItem.id)) {
      installModule(selectedItem.id)
    }
  }

  const handleInstallMemo = useMemo(() => handleInstall, [selectedItem, isModuleInstalled, installModule])

  // Determine which button to show based on state
  const buttonProps = useMemo(() => {
    switch (state) {
      case "off":
        return { label: "START", onClick: turnOn }
      case "on":
        return {
          label: "POWER UP ↑",
          onClick: activate,
          className: "power-up-glow",
        }
      case "active":
        return {
          label: selectedItem
            ? isModuleInstalled(selectedItem.id)
              ? "ALREADY INSTALLED"
              : "INSTALL MODULE"
            : "SELECT A MODULE",
          onClick: handleInstallMemo,
          disabled: !selectedItem || (selectedItem && isModuleInstalled(selectedItem.id)),
        }
    }
  }, [state, selectedItem, turnOn, activate, handleInstallMemo, isModuleInstalled])

  return (
    <div className="w-[900px] h-[600px] relative">
      <TVFrame onPowerClick={togglePower} isPowered={state !== "off"}>
        <div className="flex h-full">
          {/* Left side */}
          <div className="w-1/3 p-4 flex flex-col items-center justify-between">
            <CircularDisplay state={state} />
            <div className="my-4 w-full h-64">
              <ListDisplay items={DEFAULT_ITEMS} state={state} selectedItem={selectedItem} onSelectItem={selectItem} />
            </div>
            <ActionButton {...buttonProps} tvState={state} />
          </div>

          {/* Right side */}
          <div className="w-2/3 p-4 h-full">
            <DetailScreen state={state} selectedItem={selectedItem} />
          </div>
        </div>
      </TVFrame>
    </div>
  )
}

