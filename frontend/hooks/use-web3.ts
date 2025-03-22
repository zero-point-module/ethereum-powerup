import { useWeb3 as useWeb3Context } from '../contexts/Web3Context';
import { useWeb3Store } from '../store/web3Store';

export function useWeb3() {
  const { 
    provider, 
    signer, 
    connect, 
    disconnect 
  } = useWeb3Context();
  
  const { 
    address,
    chainId,
    isConnecting,
    error,
    isUpgraded,
    installedModules,
  } = useWeb3Store();

  return {
    // Connection state
    isConnected: !!address,
    isConnecting,
    error,
    
    // Account info
    address,
    chainId,
    isUpgraded,
    installedModules,
    
    // Web3 instances
    provider,
    signer,
    
    // Actions
    connect,
    disconnect,
  };
} 