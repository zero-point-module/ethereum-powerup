import { useQuery } from '@tanstack/react-query';
import { useWeb3Store } from '../../store/web3Store';
import {
  SEPOLIA_CHAIN_ID,
  EIP7702_DELEGATION_PREFIX,
  SMART_WALLET_ADDRESS,
} from './constants';

/**
 * Hook to check if the connected EOA is upgraded to a smart account
 * Uses ethers.js to check if the account has code that matches the EIP7702 delegation prefix
 */
export function useEOAStatus() {
  const { provider, address, chainId, setIsUpgraded, setDelegatedAddress } =
    useWeb3Store();

  return useQuery({
    queryKey: ['eoaStatus', address],
    enabled: !!provider && !!address && chainId === SEPOLIA_CHAIN_ID,
    queryFn: async () => {
      if (!provider || !address)
        throw new Error('Provider or address not available');

      try {
        console.log('Checking EOA status for address:', address);

        // Get the code at the address to see if it's been upgraded
        const code = await provider.getCode(address);

        // Check if the code starts with the EIP7702 delegation prefix
        const isUpgraded =
          code !== '0x' && code.startsWith(EIP7702_DELEGATION_PREFIX);
        console.log('Account code:', code);
        console.log('Is EOA upgraded:', isUpgraded);

        // Extract the delegated address from the code if upgraded
        let delegatedAddress = null;
        if (isUpgraded) {
          // The delegated address is the remaining part of the code after the prefix
          delegatedAddress =
            '0x' +
            code.slice(
              EIP7702_DELEGATION_PREFIX.length,
              EIP7702_DELEGATION_PREFIX.length + 40
            );
          console.log('Delegated to smart wallet address:', delegatedAddress);

          // Verify that this matches what we expect
          const expectedAddress = SMART_WALLET_ADDRESS.toLowerCase();
          const actualAddress = delegatedAddress.toLowerCase();
          console.log('Expected:', expectedAddress, 'Actual:', actualAddress);

          if (actualAddress !== expectedAddress) {
            console.warn('Unexpected delegation address');
          }
        }

        // Update global state
        setIsUpgraded(isUpgraded);
        setDelegatedAddress(delegatedAddress);

        return {
          isUpgraded,
          delegatedAddress,
          isPoweredUp: isUpgraded, // Alias for UI-friendly terminology
        };
      } catch (error) {
        console.error('Error checking EOA status:', error);
        throw new Error(
          `Failed to check account status: ${
            error instanceof Error ? error.message : String(error)
          }`
        );
      }
    },
    // Refetch periodically to make sure we have the latest status
    refetchInterval: 15_000, // Check every 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true,
  });
}
