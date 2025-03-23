import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useWeb3Store } from '../../store/web3Store';
import { SMART_WALLET_ABI } from '../../constants/SmartWalletABI';
import type { Item } from '../../types/index';
import ModularAccount from '../../constants/ModularAccount.json';
import { useState } from 'react';

const MODULE_TYPE_EXECUTOR = 2;

export function useModules() {
  const [isInstalling, setIsInstalling] = useState(false);
  const [isUninstalling, setIsUninstalling] = useState(false);

  const {
    signer,
    address,
    delegatedAddress,
    installedModules,
    addModule,
    removeModule,
  } = useWeb3Store();
  const queryClient = useQueryClient();

  const install = useMutation({
    mutationFn: async (module: Item) => {
      setIsInstalling(true);

      if (!signer || !delegatedAddress) {
        throw new Error('Signer or delegated address not available');
      }

      const smartWallet = new ethers.Contract(
        delegatedAddress,
        ModularAccount.abi,
        signer
      );

      const bytesInitData = ethers.AbiCoder.defaultAbiCoder().encode(
        ['address[]', 'uint256', 'uint256'],
        [['0xFA9cB6DbB7cd427EE221c0B2f0185D94d3d54730'], 3, 1_000]
      );

      const tx = await smartWallet.installModule(
        MODULE_TYPE_EXECUTOR,
        module.contractAddress,
        bytesInitData
      );
      await tx.wait();
      addModule(module);
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eoaStatus', address] });
    },
    onSettled: () => {
      setIsInstalling(false);
    },
  });

  const uninstall = useMutation({
    mutationFn: async (moduleId: string) => {
      setIsUninstalling(true);

      if (!signer || !delegatedAddress) {
        throw new Error('Signer or delegated address not available');
      }

      const module = installedModules.find((m) => m.id === moduleId);
      if (!module) throw new Error('Module not found');

      const smartWallet = new ethers.Contract(
        delegatedAddress,
        SMART_WALLET_ABI,
        signer
      );

      const tx = await smartWallet.uninstallModule(module.contractAddress);
      await tx.wait();
      removeModule(moduleId);
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eoaStatus', address] });
    },
    onSettled: () => {
      setIsUninstalling(false);
    },
  });

  return {
    install,
    uninstall,
    installedModules,
    isInstalling,
    isUninstalling,
  };
}
