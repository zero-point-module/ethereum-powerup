import { ethers as hardhatEthers } from "hardhat";
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  console.log("Deploying ModularAccount");
  const ModularAccountFactory = await hardhatEthers.getContractFactory("ModularAccount");
  const modularAccount = await ModularAccountFactory.deploy();
  await modularAccount.waitForDeployment();

  console.log("ModularAccount deployed to", await modularAccount.getAddress());
}
