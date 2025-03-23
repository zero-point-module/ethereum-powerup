import { useQuery } from '@tanstack/react-query';
import { useWeb3Store } from '../../stores/web3Store';
import { SEPOLIA_CHAIN_ID, EIP7702_DELEGATION_PREFIX } from './constants';

export function useEOAStatus() {
  const { provider, address, chainId, setIsUpgraded, setDelegatedAddress } = useWeb3Store();
  
  return useQuery({
    queryKey: ['eoaStatus', address],
    enabled: !!provider && !!address && chainId === SEPOLIA_CHAIN_ID,
    queryFn: async () => {
      if (!provider || !address) throw new Error('Provider or address not available');
      
      const code = await provider.getCode(address);
      const isUpgraded = code.startsWith(EIP7702_DELEGATION_PREFIX);
      console.log('isUpgraded', isUpgraded);
      const delegatedAddress = isUpgraded ? '0x' + code.slice(EIP7702_DELEGATION_PREFIX.length) : null;
      
      console.log('code', code);

      setIsUpgraded(isUpgraded);
      setDelegatedAddress(delegatedAddress);
      
      return { isUpgraded, delegatedAddress };
    },
  });
} 