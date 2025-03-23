import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { DeployFunction } from "hardhat-deploy/types";
import "@matterlabs/hardhat-zksync-solc";

const deployFunction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.log("Deploying ModularAccount on ZKSync...");

  // Get the private key from env
  const privateKey = process.env.PRIVATE_KEY_RELAYER;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY_RELAYER is not set");
  }

  const artifact = await hre.deployer.loadArtifact(
    "contracts/zksync/ModularAccount.sol:ModularAccount"
  );
  const contract = await hre.deployer.deploy(artifact, []);

  console.log(`ModularAccount deployed to: ${await contract.getAddress()}`);
};

deployFunction.tags = ["ModularAccount-zk", "all-zk"];

export default deployFunction;
