import { useMemo } from 'react';
import { ActionButton } from './action-button';
import type { Item, TVState } from '@/types';
import { useUpgradeEOA } from '@/hooks/eoa';
import { useModules } from '@/hooks/eoa/use-modules';
interface TVControlsProps {
  state: TVState;
  selectedItem: Item | null;
  isWorkbenchActive: boolean;
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
  onTurnOn,
  onActivate,
  onInstall,
  onUninstall,
  onWorkbenchToggle,
}: TVControlsProps) {
  // Use the hook for EIP7702 transactions
  const { upgradeEOA, isUpgrading, isReady: canUpgrade } = useUpgradeEOA();
  const { installedModules } = useModules();

  // Get the current selected module's installation status
  const isCurrentModuleInstalled = selectedItem
    ? installedModules.some((module) => module.id === selectedItem.id)
    : false;

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
          onClick: () => {
            // First update the UI state
            onActivate();

            // Call the mutate function correctly
            // The empty object is passed to match the mutate function's expected parameters
            upgradeEOA(undefined, {
              onSuccess: () => console.log('Upgrade completed successfully'),
              onError: (error) => console.error('Upgrade failed:', error),
            });
          },
          variant: 'power-up' as const,
          isLoading: isUpgrading,
          disabled: !canUpgrade,
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
        if (isCurrentModuleInstalled) {
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
    isCurrentModuleInstalled,
    onTurnOn,
    onActivate,
    upgradeEOA,
    isUpgrading,
    canUpgrade,
    onInstall,
    onUninstall,
    isWorkbenchActive,
    onWorkbenchToggle,
  ]);

  return <ActionButton {...buttonProps} tvState={state} />;
}
