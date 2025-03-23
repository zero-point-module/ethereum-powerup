import { HardhatRuntimeEnvironment } from "hardhat/types";
import { ethers } from "hardhat";

// This function will be used by hardhat-deploy
export default async function deploy(hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("deploying modular account");
  const modularAccount = await deploy("ModularAccount", {
    from: deployer,
    args: [], // constructor arguments if any
    log: true,
    deterministicDeployment: true,
  });

  console.log("ModularAccount deployed to:", modularAccount.address);
}

// Tag the deployment for organization
deploy.tags = ["ModularAccount", "all"];
