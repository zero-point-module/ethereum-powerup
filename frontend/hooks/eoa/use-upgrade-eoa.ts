import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useWeb3Store } from "../../stores/web3Store";
import { SMART_WALLET_ADDRESS } from "./constants";
import { EIP7702Signer } from "../../utils/eip7702-signer";

export function useUpgradeEOA() {
  const { signer, address, relayer } = useWeb3Store();
  const queryClient = useQueryClient();

  const upgradeMutation = useMutation({
    mutationFn: async () => {
      if (!signer) {
        throw new Error("Wallet not connected");
      }
      
      if (!(signer instanceof EIP7702Signer)) {
        throw new Error("Wallet does not support EIP-7702");
      }

      try {
        // Get authorization for the smart wallet
        const auth = await signer.authorize({
          address: SMART_WALLET_ADDRESS,
        });

        // Send the upgrade transaction
        const tx = await relayer?.sendTransaction({
          type: 4,
          to: ethers.ZeroAddress,
          authorizationList: [auth as any],
        });

        // Wait for confirmation
        const receipt = await tx.wait();

        console.log('Upgrade transaction receipt:', receipt);
        return receipt;
      } catch (error) {
        // Enhance error messages for common cases
        if (error instanceof Error) {
          if (error.message.includes("user rejected")) {
            throw new Error("User rejected the upgrade request");
          }
          if (error.message.includes("insufficient funds")) {
            throw new Error("Insufficient funds to perform the upgrade");
          }
        }
        console.error("Error upgrading EOA:", error);
        throw new Error("Failed to upgrade wallet");
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: ["eoaStatus", address] 
      });
    },
  });

  return {
    upgradeEOA: upgradeMutation.mutate,
    isUpgrading: upgradeMutation.isPending,
    error: upgradeMutation.error,
    isReady: !!signer && signer instanceof EIP7702Signer,
  };
}
