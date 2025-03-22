import { useQuery } from '@tanstack/react-query';
import { Contract } from 'ethers';
import { useUserStore } from '../stores/userStore';
import type { EOAUpgradeContract } from '../contracts/types';
import { EOA_UPGRADE_ABI, EOA_UPGRADE_ADDRESS_SEPOLIA } from '../contracts/types';
import { AVAILABLE_MODULES } from '../constants/modules';

export function useIsUpgraded(provider: any) {
  const address = useUserStore((state) => state.address);
  const setIsUpgraded = useUserStore((state) => state.setIsUpgraded);

  return useQuery({
    queryKey: ['isUpgraded', address],
    queryFn: async () => {
      if (!address || !provider) return false;
      
      const contract = new Contract(
        EOA_UPGRADE_ADDRESS_SEPOLIA,
        EOA_UPGRADE_ABI,
        provider
      ) as unknown as EOAUpgradeContract;
      
      const isUpgraded = await contract.isUpgraded(address);
      setIsUpgraded(isUpgraded);
      return isUpgraded;
    },
    enabled: !!address && !!provider,
  });
}

export function useInstalledModules(provider: any) {
  const address = useUserStore((state) => state.address);
  const setInstalledModules = useUserStore((state) => state.setInstalledModules);

  return useQuery({
    queryKey: ['installedModules', address],
    queryFn: async () => {
      if (!address || !provider) return [];
      
      const contract = new Contract(
        EOA_UPGRADE_ADDRESS_SEPOLIA,
        EOA_UPGRADE_ABI,
        provider
      ) as unknown as EOAUpgradeContract;
      
      const moduleIds = await contract.getInstalledModules(address);
      const modules = AVAILABLE_MODULES.filter((mod) => moduleIds.includes(mod.id));
      setInstalledModules(modules);
      return modules;
    },
    enabled: !!address && !!provider,
  });
}

export function useAvailableModules() {
  return useQuery({
    queryKey: ['availableModules'],
    queryFn: () => AVAILABLE_MODULES,
    staleTime: Infinity, // This data never changes
  });
} 