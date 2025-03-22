import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useWeb3 } from '../../contexts/Web3Context';
import { useWeb3Store } from '../../store/web3Store';
import { SMART_WALLET_ADDRESS } from './constants';

export function useUpgradeEOA() {
  const { signer } = useWeb3();
  const { address } = useWeb3Store();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!signer) throw new Error('Signer not available');
      
      const auth = await signer.authorize({
        address: SMART_WALLET_ADDRESS,
      });
      
      const tx = await signer.sendTransaction({
        type: 4,
        to: ethers.ZeroAddress,
        authorizationList: [auth],
      });
      
      await tx.wait();
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eoaStatus', address] });
    },
  });
} 