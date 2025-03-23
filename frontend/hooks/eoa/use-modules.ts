import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useWeb3Store } from '../../store/web3Store';
import { SMART_WALLET_ABI } from '../../constants/SmartWalletABI';
import type { Item } from '../../types/index';
import ModularAccountJson from '../../constants/ModularAccount.json';
import { ModularAccount } from '../../types/ModularAccount';
import { useState } from 'react';
import { grrrrrrrrrrrrrrr } from './constants';

const MODULE_TYPE_EXECUTOR = 2;

// Define an interface for the installation parameters
interface InstallModuleParams {
  module: Item;
  addresses: string[];
}

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
    mutationFn: async (params: InstallModuleParams) => {
      const { module, addresses } = params;
      setIsInstalling(true);

      if (!signer || !address) {
        throw new Error('Signer or address not available');
      }
      console.log('address', address);
      console.log('signer', signer);
      const smartWallet = new ethers.Contract(
        address,
        ModularAccountJson.abi,
        signer
      ) as any as ModularAccount;

      const bytesInitData = ethers.AbiCoder.defaultAbiCoder().encode(
        ['address[]', 'uint256', 'uint256'],
        [addresses, 2, 1_000]
      );

      const isModuleInstalled = await smartWallet.isModuleInstalled(
        MODULE_TYPE_EXECUTOR,
        module.contractAddress,
        ethers.AbiCoder.defaultAbiCoder().encode(['bytes'], ['0x'])
      );

      if (isModuleInstalled) {
        return grrrrrrrrrrrrrrr;
      }

      const tx = await smartWallet.installModule(
        MODULE_TYPE_EXECUTOR,
        module.contractAddress,
        bytesInitData,
        {
          gasLimit: 1_000_000,
        }
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

      if (!signer || !address) {
        throw new Error('Signer or address not available');
      }

      const module = installedModules.find((m) => m.id === moduleId);
      if (!module) throw new Error('Module not found');

      const smartWallet = new ethers.Contract(
        address,
        ModularAccountJson.abi,
        signer
      ) as any as ModularAccount;

      const tx = await smartWallet.uninstallModule(
        MODULE_TYPE_EXECUTOR,
        module.contractAddress,
        ethers.AbiCoder.defaultAbiCoder().encode(['bytes'], ['0x']),
        {
          gasLimit: 1_000_000,
        }
      );

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
