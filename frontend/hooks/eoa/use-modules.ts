import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useWeb3Store } from '../../store/web3Store';
import { SMART_WALLET_ABI } from '../../constants/SmartWalletABI';
import type { Item } from '../../types/index';

export function useModules() {
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
      if (!signer || !delegatedAddress) {
        throw new Error('Signer or delegated address not available');
      }

      const smartWallet = new ethers.Contract(
        delegatedAddress,
        SMART_WALLET_ABI,
        signer
      );

      const tx = await smartWallet.installModule(module.contractAddress);
      await tx.wait();
      addModule(module);
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eoaStatus', address] });
    },
  });

  const uninstall = useMutation({
    mutationFn: async (moduleId: string) => {
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
  });

  return {
    install,
    uninstall,
    isInstalling: install.isPending,
    isUninstalling: uninstall.isPending,
    installedModules,
  };
}
