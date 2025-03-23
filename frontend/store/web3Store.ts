import { create } from 'zustand';
import { JsonRpcProvider, JsonRpcSigner, Wallet, ethers } from 'ethers';
import type { Item } from '../types/index';
import { DEFAULT_MODULES } from '../constants/modules';
import ModularAccountJson from '../constants/ModularAccount.json';
import { ModularAccount } from '../types/ModularAccount';

interface Web3State {
  provider: JsonRpcProvider | null;
  signer: JsonRpcSigner | null | Wallet;
  relayer: Wallet | null;
  chainId: number | null;
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  // EOA upgrade status
  isUpgraded: boolean;
  delegatedAddress: string | null;
  // Module management
  installedModules: Item[];
}

interface Web3Actions {
  setProvider: (provider: JsonRpcProvider | null) => void;
  setSigner: (signer: JsonRpcSigner | null | Wallet) => void;
  setRelayer: (relayer: Wallet | null) => void;
  setChainId: (chainId: number | null) => void;
  setAddress: (address: string | null) => void;
  setIsConnected: (isConnected: boolean) => void;
  setIsConnecting: (isConnecting: boolean) => void;
  setError: (error: Error | null) => void;
  // EOA upgrade actions
  setIsUpgraded: (isUpgraded: boolean) => void;
  setDelegatedAddress: (address: string | null) => void;
  // Module management actions
  addModule: (module: Item) => void;
  removeModule: (moduleId: string) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  reset: () => void;
  setSignerFromPrivateKey: (privateKey: string) => void;
  loadInstalledModules: () => Promise<void>;
}

type Web3Store = Web3State & Web3Actions;

const MODULE_TYPE_EXECUTOR = 2;

export const useWeb3Store = create<Web3Store>((set, get) => ({
  // State
  provider: null,
  signer: null,
  relayer: null,
  chainId: null,
  address: null,
  isConnected: false,
  isConnecting: false,
  error: null,
  isUpgraded: false,
  delegatedAddress: null,
  installedModules: [],

  // Actions
  setProvider: (provider) => set({ provider }),
  setSigner: (signer) => set({ signer }),
  setRelayer: (relayer) => set({ relayer }),
  setChainId: (chainId) => set({ chainId }),
  setAddress: (address) => set({ address }),
  setIsConnected: (isConnected) => set({ isConnected }),
  setIsConnecting: (isConnecting) => set({ isConnecting }),
  setError: (error) => set({ error }),
  setIsUpgraded: (isUpgraded) => set({ isUpgraded }),
  setDelegatedAddress: (delegatedAddress) => set({ delegatedAddress }),
  
  setSignerFromPrivateKey: (privateKey) => {
    try {
      const provider = new JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL || '');
      const wallet = new Wallet(privateKey, provider);
      set({ 
        signer: wallet,
        address: wallet.address
      });
      
      // Load installed modules after changing signer
      get().loadInstalledModules();
    } catch (error) {
      set({ error: error instanceof Error ? error : new Error('Failed to set signer from private key') });
    }
  },

  // Module management actions
  addModule: (module) =>
    set((state) => ({
      installedModules: [...state.installedModules, module],
    })),
  removeModule: (moduleId) =>
    set((state) => ({
      installedModules: state.installedModules.filter((m) => m.id !== moduleId),
    })),

  reset: () =>
    set({
      provider: null,
      signer: null,
      relayer: null,
      chainId: null,
      address: null,
      isConnected: false,
      error: null,
      isUpgraded: false,
      delegatedAddress: null,
      installedModules: [],
    }),

  // Add loadInstalledModules function
  loadInstalledModules: async () => {
    const { signer, address } = get();
    
    if (!signer || !address) {
      return;
    }
    
    try {
      const smartWallet = new ethers.Contract(
        address,
        ModularAccountJson.abi,
        signer
      ) as any as ModularAccount;
      
      const installedModules: Item[] = [];
      
      // Check each module from DEFAULT_MODULES
      for (const module of DEFAULT_MODULES) {
        try {
          if (module.contractAddress === '0x0000000000000000000000000000000000000000') {
            continue; // Skip modules with zero address
          }
          
          const isInstalled = await smartWallet.isModuleInstalled(
            MODULE_TYPE_EXECUTOR,
            module.contractAddress,
            ethers.AbiCoder.defaultAbiCoder().encode(['bytes'], ['0x'])
          );
          
          if (isInstalled) {
            installedModules.push(module);
          }
        } catch (error) {
          console.error(`Error checking module ${module.id}:`, error);
        }
      }
      
      set({ installedModules });
    } catch (error) {
      console.error('Error loading installed modules:', error);
    }
  },

  connect: async () => {
    const { setIsConnecting, setError, reset, loadInstalledModules } = get();

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL || ''
      );
      
      const signer = new Wallet(
        process.env.NEXT_PUBLIC_PRIVATE_KEY || '',
        provider
      );
      const network = await provider.getNetwork();

      // Create Relayer with the same provider
      const relayerProvider = new JsonRpcProvider(
        window.ethereum?.rpcUrls?.default?.at(0) ||
          process.env.NEXT_PUBLIC_RPC_URL ||
          ''
      );

      // Make sure relayer provider is connected
      await relayerProvider.getNetwork();

      const relayer = new Wallet(
        process.env.NEXT_PUBLIC_RELAYER_PRIVATE_KEY || '',
        relayerProvider
      );

      set({
        provider,
        signer,
        relayer,
        address: signer.address,
        chainId: Number(network.chainId),
        isConnected: true,
        error: null,
      });
      
      // Load installed modules after setting signer and address
      await loadInstalledModules();
    } catch (error) {
      reset();
      setError(error instanceof Error ? error : new Error('Failed to connect'));
    } finally {
      setIsConnecting(false);
    }
  },

  disconnect: () => {
    get().reset();
  },
}));
