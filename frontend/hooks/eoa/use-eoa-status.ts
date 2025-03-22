import { useQuery } from '@tanstack/react-query';
import { useWeb3 } from '../../contexts/Web3Context';
import { useWeb3Store } from '../../store/web3Store';
import { SEPOLIA_CHAIN_ID, EIP7702_DELEGATION_PREFIX } from './constants';

export function useEOAStatus() {
  const { provider } = useWeb3();
  const { address, chainId, setIsUpgraded, setDelegatedAddress } = useWeb3Store();
  
  return useQuery({
    queryKey: ['eoaStatus', address],
    enabled: !!provider && !!address && chainId === SEPOLIA_CHAIN_ID,
    queryFn: async () => {
      if (!provider || !address) throw new Error('Provider or address not available');
      
      const code = await provider.getCode(address);
      const isUpgraded = code.startsWith(EIP7702_DELEGATION_PREFIX);
      const delegatedAddress = isUpgraded ? '0x' + code.slice(EIP7702_DELEGATION_PREFIX.length) : null;
      
      setIsUpgraded(isUpgraded);
      setDelegatedAddress(delegatedAddress);
      
      return { isUpgraded, delegatedAddress };
    },
  });
} 