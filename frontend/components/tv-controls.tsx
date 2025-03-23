import { useEffect, useState } from 'react';
import type { Item, TVState } from '@/types';
import { useUpgradeEOA, useEOAStatus } from '../hooks/eoa';
import { useModules } from '../hooks/eoa/use-modules';
import { useWeb3Store } from '../store/web3Store';
import {
  PowerUpButton,
  InstallButton,
  UninstallButton,
  BaseButton,
} from './buttons';

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
  onWorkbenchToggle,
}: TVControlsProps) {
  // All state management happens here in the parent
  const [isCheckingCondition, setIsCheckingCondition] = useState(true); // Start with true to prevent flickering
  const [isLoadingModules, setIsLoadingModules] = useState(true); // Start with true to prevent flickering
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Get the upgrade status via hooks
  const { upgradeEOAAsync, isUpgrading, isReady: canUpgrade } = useUpgradeEOA();
  const { data: eoaStatus, isLoading: isCheckingStatus } = useEOAStatus();
  const { install, uninstall, installedModules, isInstalling, isUninstalling } =
    useModules();

  // Check if wallet is already upgraded
  const isUpgraded = eoaStatus?.isUpgraded || false;

  // Initial loading state - will run only once when component mounts
  useEffect(() => {
    // Set initial load complete after a delay
    const timer = setTimeout(() => {
      setInitialLoadComplete(true);

      // Only reset checking states if we're not in a loading phase
      if (!isCheckingStatus) {
        setIsCheckingCondition(false);
        setIsLoadingModules(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isCheckingStatus]);

  // Check if module is installed
  const isModuleInstalled = (moduleId: string) => {
    return installedModules.some((module) => module.id === moduleId);
  };

  // Check if current selected module is installed
  const isCurrentModuleInstalled = selectedItem
    ? isModuleInstalled(selectedItem.id)
    : false;

  // Handlers with loading state management
  const handlePowerUp = async () => {
    try {
      // Use mutateAsync for proper promise handling
      await upgradeEOAAsync(undefined, {
        onSuccess: () => {
          console.log('Power-up transaction successful');
          // Only activate after successful completion
          onActivate();
        },
        onError: (error) =>
          console.error('Power-up transaction failed:', error),
      });
    } catch (error) {
      console.error('Error in power-up flow:', error);
    }
  };

  const handleInstall = async () => {
    if (!selectedItem) {
      console.error('No item selected');
      return;
    }

    try {
      // Optimistically add module to the installed list
      const { addModule } = useWeb3Store.getState();
      addModule(selectedItem);

      await install.mutateAsync(selectedItem);
    } catch (error) {
      console.error('Error in install flow:', error);

      const { removeModule } = useWeb3Store.getState();
      removeModule(selectedItem.id);
    }
  };

  const handleUninstall = async () => {
    if (!selectedItem) {
      console.error('No item selected');
      return;
    }

    try {
      // Optimistically remove the module from the installed list
      const { removeModule } = useWeb3Store.getState();
      removeModule(selectedItem.id);

      // Option 2: Direct access to mutation (comment out for testing)
      // await uninstall.mutateAsync(selectedItem.id);

      console.log(`Successfully uninstalled module: ${selectedItem.name}`);
    } catch (error) {
      console.error('Error in uninstall flow:', error);

      // Rollback optimistic update on error
      const { addModule } = useWeb3Store.getState();
      addModule(selectedItem);
    }
  };

  // Simulate checking and loading modules when state changes
  useEffect(() => {
    if (state === 'on') {
      setIsCheckingCondition(true);
      const timer = setTimeout(() => {
        setIsCheckingCondition(false);
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (state === 'active') {
      setIsLoadingModules(true);
      const timer = setTimeout(() => {
        setIsLoadingModules(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  // If wallet is already upgraded and in 'on' state, automatically transition to 'active'
  useEffect(() => {
    // Only auto-transition after initial loading is complete
    if (
      state === 'on' &&
      isUpgraded &&
      !isCheckingStatus &&
      !isCheckingCondition &&
      initialLoadComplete
    ) {
      onActivate();
    }
  }, [
    state,
    isUpgraded,
    isCheckingStatus,
    isCheckingCondition,
    onActivate,
    initialLoadComplete,
  ]);

  // 1. Default START button (when TV is off)
  if (state === 'off') {
    return <BaseButton label="START" onClick={onTurnOn} tvState={state} />;
  }

  if (state === 'on') {
    // 2. First show loader while checking condition
    if (isCheckingCondition || isCheckingStatus || !initialLoadComplete) {
      return (
        <BaseButton
          label="CHECKING STATUS"
          onClick={() => {}}
          disabled={true}
          tvState={state}
          isLoading={true}
        />
      );
    }

    // 3. If condition is valid (wallet is upgraded), show appropriate message
    if (isUpgraded) {
      return (
        <BaseButton
          label="READY TO ACTIVATE"
          onClick={onActivate}
          tvState={state}
        />
      );
    }

    // 4. If condition is not valid, show power up button
    return (
      <PowerUpButton
        onClick={handlePowerUp}
        tvState={state}
        isLoading={isUpgrading}
        disabled={!canUpgrade}
      />
    );
  }

  if (state === 'active') {
    // First show loader while checking module status
    // if (isLoadingModules || !initialLoadComplete) {
    //   return (
    //     <BaseButton
    //       label="CHECKING MODULES"
    //       onClick={() => {}}
    //       disabled={true}
    //       tvState={state}
    //       isLoading={true}
    //     />
    //   );
    // }

    // If no module is selected
    if (!selectedItem) {
      return (
        <BaseButton
          label="SELECT A MODULE"
          onClick={() => {}}
          disabled={true}
          tvState={state}
        />
      );
    }

    // If module is already installed, show uninstall button
    if (isCurrentModuleInstalled) {
      return (
        <UninstallButton
          onClick={handleUninstall}
          tvState={state}
          isLoading={isUninstalling}
          selectedItem={selectedItem}
          isWorkbenchActive={isWorkbenchActive}
          onWorkbenchClick={onWorkbenchToggle}
        />
      );
    }

    // Otherwise, show install button
    return (
      <InstallButton
        onClick={handleInstall}
        tvState={state}
        isLoading={isInstalling}
        selectedItem={selectedItem}
      />
    );
  }

  // Default fallback (shouldn't happen, but good to have)
  return (
    <BaseButton
      label="LOADING..."
      onClick={() => {}}
      disabled={true}
      tvState={state}
    />
  );
}
