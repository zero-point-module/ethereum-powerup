import { createContext, useContext, useEffect, useState } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers';
import { useWeb3Store } from '../store/web3Store';

interface Web3ContextType {
  provider: BrowserProvider | null;
  signer: JsonRpcSigner | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  connect: async () => {},
  disconnect: () => {},
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const { 
    setAddress, 
    setChainId, 
    setIsConnecting, 
    setError,
    reset 
  } = useWeb3Store();
  
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

  const connect = async () => {
    if (!window.ethereum) {
      setError(new Error('MetaMask is not installed'));
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      const newProvider = new BrowserProvider(window.ethereum);
      const newSigner = await newProvider.getSigner();
      const network = await newProvider.getNetwork();
      
      setProvider(newProvider);
      setSigner(newSigner);
      setAddress(accounts[0]);
      setChainId(Number(network.chainId));
      
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to connect'));
      setProvider(null);
      setSigner(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setProvider(null);
    setSigner(null);
    reset();
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnect();
        } else {
          setAddress(accounts[0]);
        }
      });

      window.ethereum.on('chainChanged', (newChainId: string) => {
        setChainId(Number(newChainId));
      });

      window.ethereum.on('disconnect', () => {
        disconnect();
      });

      // Check if already connected
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          if (accounts.length > 0) {
            connect();
          }
        })
        .catch((err: unknown) => {
          console.error('Failed to check accounts:', err);
        });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
        window.ethereum.removeListener('disconnect', () => {});
      }
    };
  }, []);

  return (
    <Web3Context.Provider 
      value={{ 
        provider,
        signer,
        connect,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => useContext(Web3Context); 