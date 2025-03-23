import { create } from "zustand";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import { EIP7702Signer } from "../utils/eip7702-signer";
import { Relayer } from "../utils/relayer";
import type { Module } from "../types/modules";

interface Web3State {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | EIP7702Signer | null;
  relayer: Relayer | null;
  chainId: number | null;
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: Error | null;
  // EOA upgrade status
  isUpgraded: boolean;
  delegatedAddress: string | null;
  // Module management
  installedModules: Module[];
}

interface Web3Actions {
  setProvider: (provider: BrowserProvider | null) => void;
  setSigner: (signer: JsonRpcSigner | EIP7702Signer | null) => void;
  setRelayer: (relayer: Relayer | null) => void;
  setChainId: (chainId: number | null) => void;
  setAddress: (address: string | null) => void;
  setIsConnected: (isConnected: boolean) => void;
  setIsConnecting: (isConnecting: boolean) => void;
  setError: (error: Error | null) => void;
  // EOA upgrade actions
  setIsUpgraded: (isUpgraded: boolean) => void;
  setDelegatedAddress: (address: string | null) => void;
  // Module management actions
  addModule: (module: Module) => void;
  removeModule: (moduleId: string) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  setupEventListeners: () => () => void;
  reset: () => void;
}

type Web3Store = Web3State & Web3Actions;

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
  setProvider: provider => set({ provider }),
  setSigner: signer => set({ signer }),
  setRelayer: relayer => set({ relayer }),
  setChainId: chainId => set({ chainId }),
  setAddress: address => set({ address }),
  setIsConnected: isConnected => set({ isConnected }),
  setIsConnecting: isConnecting => set({ isConnecting }),
  setError: error => set({ error }),
  setIsUpgraded: isUpgraded => set({ isUpgraded }),
  setDelegatedAddress: delegatedAddress => set({ delegatedAddress }),

  // Module management actions
  addModule: module =>
    set(state => ({
      installedModules: [...state.installedModules, module],
    })),
  removeModule: moduleId =>
    set(state => ({
      installedModules: state.installedModules.filter(m => m.id !== moduleId),
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

  connect: async () => {
    const { setIsConnecting, setError, reset } = get();

    if (!window.ethereum) {
      setError(new Error("MetaMask is not installed"));
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const provider = new BrowserProvider(window.ethereum);
      const baseSigner = await provider.getSigner();
      const eip7702Signer = new EIP7702Signer(provider, baseSigner.address);
      const network = await provider.getNetwork();

      // Create Relayer with the same provider
      const relayer = new Relayer(
        process.env.NEXT_PUBLIC_RELAYER_PRIVATE_KEY || "",
        window.ethereum.rpcUrls?.default?.at(0) || process.env.NEXT_PUBLIC_RPC_URL || ""
      );

      set({
        provider,
        signer: eip7702Signer,
        relayer,
        address: accounts[0],
        chainId: Number(network.chainId),
        isConnected: true,
        error: null,
      });
    } catch (error) {
      reset();
      setError(error instanceof Error ? error : new Error("Failed to connect"));
    } finally {
      setIsConnecting(false);
    }
  },

  disconnect: () => {
    get().reset();
  },

  setupEventListeners: () => {
    const { connect, disconnect, setAddress, setChainId } = get();

    if (window.ethereum) {
      // Setup event listeners
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAddress(accounts[0]);
        }
      });

      window.ethereum.on("chainChanged", (newChainId: string) => {
        setChainId(Number(newChainId));
      });

      window.ethereum.on("disconnect", () => {
        disconnect();
      });

      // Check if already connected
      window.ethereum
        .request({ method: "eth_accounts" })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            connect();
          }
        })
        .catch((err: unknown) => {
          console.error("Failed to check accounts:", err);
        });
    }

    // Return cleanup function
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
        window.ethereum.removeListener("disconnect", () => {});
      }
    };
  },
}));
