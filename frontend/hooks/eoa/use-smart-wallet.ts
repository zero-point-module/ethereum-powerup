import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useWeb3Store } from '../../store/web3Store';
import { SMART_WALLET_ABI } from '../../constants/SmartWalletABI';

export function useSmartWallet() {
  const { signer, delegatedAddress } = useWeb3Store();
  const queryClient = useQueryClient();

  const getNumber = useQuery({
    queryKey: ['smartWalletNumber', delegatedAddress],
    enabled: !!signer && !!delegatedAddress,
    queryFn: async () => {
      if (!signer || !delegatedAddress) {
        throw new Error('Smart wallet not available');
      }

      const smartWallet = new ethers.Contract(
        delegatedAddress,
        SMART_WALLET_ABI,
        signer
      );

      const number = await smartWallet.getNumber();
      return Number(number); // Convert BigNumber to number
    },
  });

  const setNumber = useMutation({
    mutationFn: async (newNumber: number) => {
      if (!signer || !delegatedAddress) {
        throw new Error('Smart wallet not available');
      }

      const smartWallet = new ethers.Contract(
        delegatedAddress,
        SMART_WALLET_ABI,
        signer
      );

      const tx = await smartWallet.setNumber(newNumber);
      await tx.wait();
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['smartWalletNumber', delegatedAddress],
      });
    },
  });

  return {
    number: getNumber.data,
    isLoading: getNumber.isLoading || !signer || !delegatedAddress,
    error: getNumber.error,
    setNumber,
    isSettingNumber: setNumber.isPending,
    isReady: !!signer && !!delegatedAddress,
  };
}
