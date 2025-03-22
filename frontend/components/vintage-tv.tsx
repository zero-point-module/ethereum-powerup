"use client"

import { useMemo } from "react"
import { TVFrame } from "./tv-frame"
import { CircularDisplay } from "./circular-display"
import { ListDisplay } from "./list-display"
import { DetailScreen } from "./detail-screen"
import { ActionButton } from "./action-button"
import { useTVState } from "@/hooks/use-tv-state"
import { AVAILABLE_MODULES } from "@/constants/modules"
import { useWeb3 } from "@/hooks/use-web3"
import { useModules, useUpgradeEOA } from "@/hooks/eoa"

export default function VintageTV() {
  const { state, selectedItem, turnOn, togglePower, selectItem } = useTVState()
  const { installedModules } = useWeb3()
  const { install: { mutate: installModule } } = useModules()
  const { mutate: activateSmartWallet } = useUpgradeEOA()

  // Handle install action
  const handleInstall = () => {
    if (selectedItem && !installedModules.includes(selectedItem.id)) {
      installModule(selectedItem.id)
    }
  }

  const handleInstallMemo = useMemo(() => handleInstall, [selectedItem, installedModules, installModule])

  // Determine which button to show based on state
  const buttonProps = useMemo(() => {
    switch (state) {
      case "off":
        return { label: "START", onClick: turnOn }
      case "on":
        return {
          label: "POWER UP ↑",
          onClick: activateSmartWallet,
          className: "power-up-glow",
        }
      case "active":
        return {
          label: selectedItem
            ? installedModules.includes(selectedItem.id)
              ? "ALREADY INSTALLED"
              : "INSTALL MODULE"
            : "SELECT A MODULE",
          onClick: handleInstallMemo,
          disabled: !selectedItem || (selectedItem && installedModules.includes(selectedItem.id)),
        }
    }
  }, [state, selectedItem, turnOn, activateSmartWallet, handleInstallMemo, installedModules])

  return (
    <div className="w-[900px] h-[600px] relative">
      <TVFrame onPowerClick={togglePower} isPowered={state !== "off"}>
        <div className="flex h-full">
          {/* Left side */}
          <div className="w-1/3 p-4 flex flex-col items-center justify-between">
            <CircularDisplay state={state} />
            <div className="my-4 w-full h-64">
              <ListDisplay items={AVAILABLE_MODULES} state={state} selectedItem={selectedItem} onSelectItem={selectItem} />
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

