'use client';

import { useCallback, useState, useEffect } from 'react';
import { TVFrame } from './tv-frame';
import { TVSidebar } from './tv-sidebar';
import { TVMainDisplay } from './tv-main-display';
import { useTVStore } from '@/store/tv-store';
import { useModulesStore } from '@/store/modules-store';
import { DEFAULT_MODULES } from '@/constants';

export default function VintageTV() {
  // Get state and actions from Zustand stores
  const { state, selectedItem, turnOn, activate, togglePower, selectItem } =
    useTVStore();

  const { isModuleInstalled, installModule, uninstallModule } =
    useModulesStore();

  const [isWorkbenchActive, setIsWorkbenchActive] = useState(false);

  // Reset workbench state when selectedItem changes
  useEffect(() => {
    // Turn off workbench mode whenever a new module is selected
    setIsWorkbenchActive(false);
  }, [selectedItem]);

  // Handle install action
  const handleInstall = useCallback(() => {
    if (selectedItem && !isModuleInstalled(selectedItem.id)) {
      installModule(selectedItem.id);
    }
  }, [selectedItem, isModuleInstalled, installModule]);

  // Handle uninstall action
  const handleUninstall = useCallback(() => {
    if (selectedItem && isModuleInstalled(selectedItem.id)) {
      uninstallModule(selectedItem.id);
    }
  }, [selectedItem, isModuleInstalled, uninstallModule]);

  // Handle workbench toggle
  const toggleWorkbench = useCallback(() => {
    if (state === 'active' && selectedItem) {
      setIsWorkbenchActive((prev) => !prev);
    }
  }, [state, selectedItem]);

  return (
    <div className="w-[900px] h-[600px] relative">
      <TVFrame onPowerClick={togglePower} isPowered={state !== 'off'}>
        <div className="flex h-full">
          {/* Left side */}
          <TVSidebar
            state={state}
            items={DEFAULT_MODULES}
            selectedItem={selectedItem}
            isWorkbenchActive={isWorkbenchActive}
            isModuleInstalled={isModuleInstalled}
            onSelectItem={selectItem}
            onTurnOn={turnOn}
            onActivate={activate}
            onInstall={handleInstall}
            onUninstall={handleUninstall}
            onWorkbenchToggle={toggleWorkbench}
          />

          {/* Right side */}
          <TVMainDisplay
            state={state}
            selectedItem={selectedItem}
            isWorkbenchActive={isWorkbenchActive}
          />
        </div>
      </TVFrame>
    </div>
  );
}
