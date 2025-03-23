import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ZeroAddress } from "ethers";
import { useWeb3Store } from "../../stores/web3Store";
import { SMART_WALLET_ADDRESS } from "./constants";

export function useUpgradeEOA() {
  const { signer, address, relayer } = useWeb3Store();
  const queryClient = useQueryClient();

  const upgradeMutation = useMutation({
    mutationFn: async () => {
      if (!signer) {
        throw new Error("Wallet not connected");
      }

      try {
        if (!relayer) {
          throw new Error("Relayer not connected");
        }

        // Make sure signer has a provider
        if (!signer.provider) {
          throw new Error("Signer needs a provider to authorize");
        }

        console.log('Starting EOA upgrade process for address:', address);
        console.log('Using SMART_WALLET_ADDRESS:', SMART_WALLET_ADDRESS);
        
        // Generate a unique nonce to prevent replay attacks
        const nonce = Date.now().toString();
        console.log('Using nonce:', nonce);
        

        // Get authorization for the smart wallet
        const auth = await signer.authorize({
          address: SMART_WALLET_ADDRESS,
          // Let the signer handle the nonce internally
        });

        console.log('Authorization obtained:', {
          address: auth.address,
          nonce: auth.nonce.toString(),
          chainId: auth.chainId.toString(),
          signature: auth.signature.toString()
        });

        // Important: In EIP-7702, to set code on an EOA:
        // 1. The tx must be sent TO the EOA itself (the account being upgraded)
        // 2. With empty calldata "0x"
        // 3. With properly formatted authorization list
        const tx = await relayer.sendTransaction({
          type: 4,
          to: ZeroAddress,  // The EOA being upgraded
          gasLimit: 10000000, // Sufficient gas
          authorizationList: [auth],
        });
        
        console.log('Upgrade transaction sent:', tx?.hash);

        console.log("use-upgrade-eoa: tx", tx);

        // Wait for confirmation
        console.log('Waiting for transaction confirmation...');
        const receipt = await tx.wait();

        console.log("Upgrade transaction receipt:", receipt);
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
          // Log the full error for debugging
          console.error("Raw error upgrading EOA:", error);
          console.error("Error message:", error.message);
          console.error("Error stack:", error.stack);
        }
        console.error("Error upgrading EOA:", error);
        throw new Error(`Failed to upgrade wallet: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({
        queryKey: ["eoaStatus", address],
      });
    },
  });

  return {
    upgradeEOA: upgradeMutation.mutate,
    isUpgrading: upgradeMutation.isPending,
    error: upgradeMutation.error,
    isReady: !!signer,
  };
}
