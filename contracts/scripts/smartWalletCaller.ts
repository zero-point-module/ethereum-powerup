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

  const experimentalEthersProvider = new experimentalEthers.JsonRpcProvider(rpcUrl);

  const experimentalEoa = new Wallet(privateKey, experimentalEthersProvider);
  const experimentalEOAAddress = await experimentalEoa.getAddress();

  try {
    const eoaSmartWallet = new experimentalEthers.Contract(
      experimentalEOAAddress,
      (await hardhatEthers.getContractFactory("ModularAccount")).interface,
      experimentalEoa // Signing with the EOA pkey (acting as tx sender)
    ) as any as ModularAccount;

    // get account address
    const accountId = await eoaSmartWallet.accountId();
    console.log("AccountId:", accountId);
  } catch (error) {
    console.error(error);
  }
}
