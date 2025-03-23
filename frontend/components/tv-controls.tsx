import { useMemo } from 'react';
import { ActionButton } from './action-button';
import type { Item, TVState } from '@/types';

interface TVControlsProps {
  state: TVState;
  selectedItem: Item | null;
  isWorkbenchActive: boolean;
  isModuleInstalled: (moduleId: number) => boolean;
  onTurnOn: () => void;
  onActivate: () => void;
  onInstall: () => void;
  onUninstall: () => void;
  onWorkbenchToggle: () => void;
}

export function TVControls({
  state,
  selectedItem,
  isWorkbenchActive,
  isModuleInstalled,
  onTurnOn,
  onActivate,
  onInstall,
  onUninstall,
  onWorkbenchToggle,
}: TVControlsProps) {
  // Determine which button to show based on state and module installation status
  const buttonProps = useMemo(() => {
    switch (state) {
      case 'off':
        return {
          label: 'START',
          onClick: onTurnOn,
          variant: 'default' as const,
        };
      case 'on':
        return {
          label: 'POWER UP ↑',
          onClick: onActivate,
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
            onClick: onUninstall,
            variant: 'uninstall' as const,
            isWorkbenchActive,
            onWorkbenchClick: onWorkbenchToggle,
          };
        }

        // Otherwise, show install button
        return {
          label: 'INSTALL MODULE',
          onClick: onInstall,
          variant: 'install' as const,
        };
    }
  }, [
    state,
    selectedItem,
    onTurnOn,
    onActivate,
    onInstall,
    onUninstall,
    isModuleInstalled,
    isWorkbenchActive,
    onWorkbenchToggle,
  ]);

  return <ActionButton {...buttonProps} tvState={state} />;
}
