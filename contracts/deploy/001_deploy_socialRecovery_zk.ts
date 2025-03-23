import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Deployer } from "@matterlabs/hardhat-zksync-deploy";
import { DeployFunction } from "hardhat-deploy/types";
import "@matterlabs/hardhat-zksync-solc";

const deployFunction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.log("Deploying SocialRecoveryModule on ZKSync...");

  // Get the private key from env
  const privateKey = process.env.PRIVATE_KEY_RELAYER;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY_RELAYER is not set");
  }

  const artifact = await hre.deployer.loadArtifact(
    "contracts/zksync/SocialRecoveryModule.sol:SocialRecoveryModule"
  );
  const contract = await hre.deployer.deploy(artifact, [
    "Social Recovery Module",
    "1.0",
  ]);

  console.log(`SocialRecoveryModule deployed to: ${await contract.getAddress()}`);
};

deployFunction.tags = ["SocialRecoveryModule-zk", "all-zk"];

export default deployFunction;
