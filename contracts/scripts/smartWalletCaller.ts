import { ethers as experimentalEthers, Wallet } from "ethers";
import { CounterModule, ModularAccount } from "../typechain-types";
import { ethers as hardhatEthers } from "hardhat";

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  if (!rpcUrl) {
    throw new Error("RPC_URL is not set");
  }

  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY is not set");
  }

  const privateKey2 = process.env.PRIVATE_KEY_2;
  if (!privateKey2) {
    throw new Error("PRIVATE_KEY_2 is not set");
  }

  const smartWallet = process.env.SMART_WALLET;
  if (!smartWallet) {
    throw new Error("SMART_WALLET is not set");
  }

  const experimentalEthersProvider = new experimentalEthers.JsonRpcProvider(rpcUrl);

  const experimentalEoa = new Wallet(privateKey, experimentalEthersProvider);
  const experimentalEOAAddress = await experimentalEoa.getAddress();

  try {
    const eoaSmartWallet = new experimentalEthers.Contract(
      experimentalEOAAddress,
      (await hardhatEthers.getContractFactory("ModularAccount")).interface,
      experimentalEoa // Signing with the EOA pkey (acting as tx sender)
    );
      
    // get account address
    const accountAddress = await eoaSmartWallet.getAddress();
    console.log("Account address", accountAddress);

    console.log("Sending EIP-7702 transaction");

    console.log("EIP-7702 transaction sent");
  } catch (error) {
    console.error(error);
  }
}
