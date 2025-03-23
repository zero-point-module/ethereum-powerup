import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";

// This function will be used by hardhat-deploy
export default async function deploy(hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("deploying social recovery module");
  const socialRecoveryModule = await deploy("SocialRecoveryModule", {
    from: deployer,
    args: ["Social Recovery Module", "1.0"], // constructor arguments if any
    log: true,
    deterministicDeployment: true,
  });

  console.log("SocialRecoveryModule deployed to:", socialRecoveryModule.address);
}

// Tag the deployment for organization
deploy.tags = ["SocialRecoveryModule", "all"];
