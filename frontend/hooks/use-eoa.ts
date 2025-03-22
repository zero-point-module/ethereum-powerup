import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useUserStore } from '../../src/store/useUserStore';
import { SMART_WALLET_ABI } from '../constants/SmartWalletABI';

// Constants for the Sepolia network
const SEPOLIA_CHAIN_ID = 11155111;
const SMART_WALLET_ADDRESS = '0x...'; // Add the deployed SmartWallet address
const EIP7702_DELEGATION_PREFIX = '0xef0100';

export function useProvider() {
  return useQuery({
    queryKey: ['provider'],
    queryFn: async () => {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      if (network.chainId !== BigInt(SEPOLIA_CHAIN_ID)) {
        throw new Error('Please connect to Sepolia network');
      }
      
      return provider;
    },
  });
}

export function useAccountStatus() {
  const { address } = useUserStore();
  const { data: provider } = useProvider();

  return useQuery({
    queryKey: ['accountStatus', address],
    enabled: !!provider && !!address,
    queryFn: async () => {
      if (!provider || !address) throw new Error('Provider or address not available');
      
      // Check if the EOA has been upgraded by looking at its code
      const code = await provider.getCode(address);
      const isUpgraded = code.startsWith(EIP7702_DELEGATION_PREFIX);
      
      // If upgraded, get the delegated contract address
      let delegatedAddress = null;
      if (isUpgraded) {
        delegatedAddress = '0x' + code.slice(EIP7702_DELEGATION_PREFIX.length);
      }
      
      // Get the current number if the account is upgraded
      let currentNumber = null;
      if (isUpgraded && delegatedAddress) {
        const smartWallet = new ethers.Contract(delegatedAddress, SMART_WALLET_ABI, provider);
        currentNumber = await smartWallet.getNumber();
      }
      
      useUserStore.getState().setIsUpgraded(isUpgraded);
      
      return {
        isUpgraded,
        delegatedAddress,
        currentNumber
      };
    },
  });
}

export function useUpgradeAccount() {
  const queryClient = useQueryClient();
  const { data: provider } = useProvider();
  
  return useMutation({
    mutationFn: async () => {
      if (!provider) throw new Error('Provider not available');
      
      const signer = await provider.getSigner();
      
      // Create the EIP-7702 authorization
      const auth = await signer.authorize({
        address: SMART_WALLET_ADDRESS,
      });
      
      // Send the EIP-7702 transaction
      const tx = await signer.sendTransaction({
        type: 4, // EIP-7702 transaction type
        to: ethers.ZeroAddress,
        authorizationList: [auth],
      });
      
      await tx.wait();
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountStatus'] });
    },
  });
}

export function useSetNumber() {
  const queryClient = useQueryClient();
  const { data: provider } = useProvider();
  const { data: accountStatus } = useAccountStatus();
  
  return useMutation({
    mutationFn: async (newNumber: number) => {
      if (!provider || !accountStatus?.delegatedAddress) {
        throw new Error('Provider or delegated address not available');
      }
      
      const signer = await provider.getSigner();
      const smartWallet = new ethers.Contract(
        accountStatus.delegatedAddress,
        SMART_WALLET_ABI,
        signer
      );
      
      const tx = await smartWallet.setNumber(newNumber);
      await tx.wait();
      
      return tx;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accountStatus'] });
    },
  });
} 