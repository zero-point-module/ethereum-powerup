'use client';

import { useMemo, useCallback, useState } from 'react';
import { TVFrame } from './tv-frame';
import { CircularDisplay } from './circular-display';
import { ListDisplay } from './list-display';
import { DetailScreen } from './detail-screen';
import { ActionButton } from './action-button';
import { useInstalledModules } from '@/contexts/installed-modules-context';
import { useTVState } from '@/hooks/use-tv-state';
import { DEFAULT_MODULES } from '@/constants';

export default function VintageTV() {
  const { state, selectedItem, turnOn, activate, togglePower, selectItem } =
    useTVState();
  const { isModuleInstalled, installModule, uninstallModule } =
    useInstalledModules();
  const [isWorkbenchActive, setIsWorkbenchActive] = useState(false);

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

  // Determine which button to show based on state and module installation status
  const buttonProps = useMemo(() => {
    switch (state) {
      case 'off':
        return {
          label: 'START',
          onClick: turnOn,
          variant: 'default' as const,
        };
      case 'on':
        return {
          label: 'POWER UP ↑',
          onClick: activate,
          variant: 'power-up' as const,
        };
      case 'active':
        // If no item is selected
        if (!selectedItem) {
          return {
            label: 'SELECT A MODULE',
            onClick: () => {},
            disabled: true,
            variant: 'default' as const,
          };
        }

        // If selected item is installed, show uninstall button
        if (isModuleInstalled(selectedItem.id)) {
          return {
            label: 'UNINSTALL MODULE',
            onClick: handleUninstall,
            variant: 'uninstall' as const,
            isWorkbenchActive,
            onWorkbenchClick: toggleWorkbench,
          };
        }

        // Otherwise, show install button
        return {
          label: 'INSTALL MODULE',
          onClick: handleInstall,
          variant: 'install' as const,
        };
    }
  }, [
    state,
    selectedItem,
    turnOn,
    activate,
    handleInstall,
    handleUninstall,
    isModuleInstalled,
    isWorkbenchActive,
    toggleWorkbench,
  ]);

  return (
    <div className="w-[900px] h-[600px] relative">
      <TVFrame onPowerClick={togglePower} isPowered={state !== 'off'}>
        <div className="flex h-full">
          {/* Left side */}
          <div className="w-1/3 p-4 flex flex-col items-center justify-between">
            <CircularDisplay state={state} />
            <div className="my-4 w-full h-64">
              <ListDisplay
                items={DEFAULT_MODULES}
                state={state}
                selectedItem={selectedItem}
                onSelectItem={selectItem}
              />
            </div>
            <ActionButton {...buttonProps} tvState={state} />
          </div>

          {/* Right side */}
          <div className="w-2/3 p-4 h-full">
            <DetailScreen
              state={state}
              selectedItem={selectedItem}
              isWorkbenchActive={isWorkbenchActive}
            />
          </div>
        </div>
      </TVFrame>
    </div>
  );
}
