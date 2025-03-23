'use client';

import { useCallback, useState, useEffect } from 'react';
import { TVFrame } from './tv-frame';
import { TVSidebar } from './tv-sidebar';
import { TVMainDisplay } from './tv-main-display';
import { useTVStore } from '@/store/tv-store';
import { DEFAULT_MODULES } from '@/constants';
import { useModules } from '@/hooks/eoa/use-modules';
export default function VintageTV() {
  // Get state and actions from Zustand stores
  const { state, selectedItem, turnOn, activate, selectItem } = useTVStore();

  const { installedModules, install, uninstall, isInstalling, isUninstalling } =
    useModules();

  const [isWorkbenchActive, setIsWorkbenchActive] = useState(false);

  // Reset workbench state when selectedItem changes
  useEffect(() => {
    // Turn off workbench mode whenever a new module is selected
    setIsWorkbenchActive(false);
  }, [selectedItem]);

  // Handle workbench toggle
  const toggleWorkbench = useCallback(() => {
    if (state === 'active' && selectedItem) {
      setIsWorkbenchActive((prev) => !prev);
    }
  }, [state, selectedItem]);

  return (
    <div className="w-[900px] h-[600px] relative">
      <TVFrame>
        <div className="flex h-full">
          {/* Left side */}
          <TVSidebar
            state={state}
            items={DEFAULT_MODULES}
            selectedItem={selectedItem}
            isWorkbenchActive={isWorkbenchActive}
            onSelectItem={selectItem}
            onTurnOn={turnOn}
            onActivate={activate}
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
