import { ethers as experimentalEthers, Wallet } from "ethers";

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

  const privateKey2 = process.env.PRIVATE_KEY_RELAYER;
  if (!privateKey2) {
    throw new Error("PRIVATE_KEY_RELAYER is not set");
  }

  const smartWallet = process.env.SMART_WALLET;
  if (!smartWallet) {
    throw new Error("SMART_WALLET is not set");
  }

  const experimentalEthersProvider = new experimentalEthers.JsonRpcProvider(rpcUrl);

  const experimentalEoa = new Wallet(privateKey, experimentalEthersProvider);
  const experimentalEOAAddress = await experimentalEoa.getAddress();

  const experimentalEoa2 = new Wallet(privateKey2, experimentalEthersProvider);
  const experimentalEOA2Address = await experimentalEoa2.getAddress();

  console.log("Using", {
    rpcUrl,
    experimentalEOAAddress,
    experimentalEOA2Address,
    smartWallet,
  });

  try {
    const auth = await experimentalEoa.authorize({
      address: smartWallet,
      //address: experimentalEthers.ZeroAddress,
    });
    console.log('the signer', experimentalEoa.address, 'authorizing to', smartWallet);

    console.log("Sending EIP-7702 transaction with relayer", experimentalEoa2.address);
    const tx = await experimentalEoa2.sendTransaction({
      type: 4, // EIP-7702 transaction type
      to: experimentalEthers.ZeroAddress,
      authorizationList: [auth],
      gasLimit: 1000000,
    });
    await tx.wait();

    console.log("EIP-7702 transaction sent");
  } catch (error) {
    console.error(error);
  }
}
