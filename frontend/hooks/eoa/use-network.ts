import { useMutation } from '@tanstack/react-query';
import { useWeb3Store } from '../../stores/web3Store';
import { SEPOLIA_CHAIN_ID } from './constants';

const SEPOLIA_PARAMS = {
  chainId: `0x${SEPOLIA_CHAIN_ID.toString(16)}`, // 11155111 in hex
  chainName: 'Sepolia',
  nativeCurrency: {
    name: 'Sepolia ETH',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL || ''], // Using the public RPC endpoint
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

export function useNetwork() {
  const { setError, setChainId, provider } = useWeb3Store();

  return useMutation({
    mutationFn: async () => {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      try {
        // First try to add the network
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [SEPOLIA_PARAMS],
          });
        } catch (addError: any) {
          // Ignore error if chain already exists
          console.log('Chain might already exist:', addError.message);
        }

        // Then try to switch to it
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_PARAMS.chainId }],
        });

        // Wait for the network to be fully switched
        return new Promise<void>((resolve, reject) => {
          // Set a timeout to prevent hanging
          const timeout = setTimeout(() => {
            reject(new Error('Network switch timeout'));
          }, 10000);

          // Listen for network change
          const handleNetworkChange = async () => {
            try {
              const network = await provider?.getNetwork();
              if (network && Number(network.chainId) === SEPOLIA_CHAIN_ID) {
                setChainId(SEPOLIA_CHAIN_ID);
                clearTimeout(timeout);
                resolve();
              }
            } catch (error) {
              // Ignore network change errors
              console.log('Network change event error:', error);
            }
          };

          // Add event listener
          if (window.ethereum) {
            window.ethereum.on('chainChanged', handleNetworkChange);
            // Clean up on success or timeout
            setTimeout(() => {
              window.ethereum?.removeListener('chainChanged', handleNetworkChange);
            }, 10000);
          }

          // Initial check in case we missed the event
          handleNetworkChange();
        });
      } catch (error: any) {
        // If user rejected the request
        if (error.code === 4001) {
          throw new Error('User rejected the network switch');
        }
        // For any other error
        throw new Error(error.message || 'Failed to switch network');
      }
    },
    onError: (error: Error) => {
      setError(error);
      console.error('Network switch error:', error);
    },
  });
} 