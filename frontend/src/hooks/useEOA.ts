import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useUserStore } from '../store/useUserStore';
import { AVAILABLE_MODULES, type Module } from '../constants/modules';

// Constants for the Sepolia network
const SEPOLIA_CHAIN_ID = 11155111;
const EOA_REGISTRY_ADDRESS = '0x...'; // Add the deployed registry contract address

// ABI for the registry contract (simplified version)
const EOA_REGISTRY_ABI = [
  'function isUpgraded(address account) view returns (bool)',
  'function getInstalledModules(address account) view returns (address[])',
  'function upgradeAccount() external',
  'function installModule(address module) external'
];

export function useProvider() {
  return useQuery({
    queryKey: ['provider'],
    queryFn: async () => {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      if (network.chainId !== BigInt(SEPOLIA_CHAIN_ID)) {
        throw new Error('Please connect to Sepolia network');
      }
      
      return provider;
    },
  });
}

export function useAccountStatus() {
  const { address } = useUserStore();
  const { data: provider } = useProvider();

  return useQuery({
    queryKey: ['accountStatus', address],
    enabled: !!provider && !!address,
    queryFn: async () => {
      if (!provider || !address) throw new Error('Provider or address not available');
      
      const registry = new ethers.Contract(EOA_REGISTRY_ADDRESS, EOA_REGISTRY_ABI, provider);
      const isUpgraded = await registry.isUpgraded(address);
      const installedModuleAddresses = await registry.getInstalledModules(address);
      
      // Map the addresses to module information
      const installedModules = installedModuleAddresses
        .map((moduleAddress: string) => 
          AVAILABLE_MODULES.find(
            (module: Module) => module.contractAddress.toLowerCase() === moduleAddress.toLowerCase()
          )
        )
        .filter((module: Module | undefined): module is Module => module !== undefined);
      
      useUserStore.getState().setIsUpgraded(isUpgraded);
      useUserStore.getState().setInstalledModules(installedModules);
      
      return {
        isUpgraded,
        installedModules,
      };
    },
  });
}

export function useUpgradeAccount() {
  const queryClient = useQueryClient();
  const { data: provider } = useProvider();
  
  return useMutation({
    mutationFn: async () => {
      if (!provider) throw new Error('Provider not available');
      
      const signer = await provider.getSigner();
      const registry = new ethers.Contract(EOA_REGISTRY_ADDRESS, EOA_REGISTRY_ABI, signer);
      
      const tx = await registry.upgradeAccount();
      await tx.wait();
      
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountStatus'] });
    },
  });
}

export function useInstallModule() {
  const queryClient = useQueryClient();
  const { data: provider } = useProvider();
  
  return useMutation({
    mutationFn: async (moduleAddress: string) => {
      if (!provider) throw new Error('Provider not available');
      
      const signer = await provider.getSigner();
      const registry = new ethers.Contract(EOA_REGISTRY_ADDRESS, EOA_REGISTRY_ABI, signer);
      
      const tx = await registry.installModule(moduleAddress);
      await tx.wait();
      
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountStatus'] });
    },
  });
} 