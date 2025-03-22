import { expect } from "chai";
import { ethers as hardhatEthers } from "hardhat";
import { ethers as experimentalEthers, Wallet } from "ethers";
import { Counter, CounterModule, ModularAccount } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

const MODULE;
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error("PRIVATE_KEY is not set");
}

describe("EIP-7702: Set EOA Account Code", function () {
  let counter: Counter;
  let modularAccount: ModularAccount;
  let counterModule: CounterModule;

  let deployer: SignerWithAddress;
  let eoa: SignerWithAddress;

  let experimentalEoa: Wallet;

  before(async function () {
    // Check if we're using a supported network for EIP-7702
    const network = await hardhatEthers.provider.getNetwork();
    console.log(`Running on network: ${network.name} (chainId: ${network.chainId}) \n`);
  });

  beforeEach(async function () {
    // 1. Get signers and deploy the SmartWallet contract
    [deployer, eoa] = await hardhatEthers.getSigners();
    experimentalEoa = new Wallet(privateKey, hardhatEthers.provider);

    // Deploy the Counter contract
    const CounterFactory = await hardhatEthers.getContractFactory("Counter");
    counter = await CounterFactory.deploy();
    await counter.waitForDeployment();

    // Deploy the ERC-7579 Modular Account
    const ModularAccountFactory = await hardhatEthers.getContractFactory("ModularAccount");
    modularAccount = await ModularAccountFactory.deploy();
    await modularAccount.waitForDeployment();

    // Deploy the CounterModule contract
    const CounterModuleFactory = await hardhatEthers.getContractFactory("CounterModule");
    counterModule = await CounterModuleFactory.deploy();
    await counterModule.waitForDeployment();
  });

  it("should set EOA account code using EIP-7702", async function () {
    // 2. Perform the EIP-7702 designation (authorize EOA to use SmartWallet's code)
    // Note: This uses the experimental ethers.js API for EIP-7702
    const auth = await experimentalEoa.authorize({
      address: await counter.getAddress(),
    });

    const tx = await deployer.sendTransaction({
      type: 4, // EIP-7702 transaction type
      to: experimentalEthers.ZeroAddress,
      authorizationList: [auth],
    });
    await tx.wait();

    const eoaAsWallet = counter.connect(eoa);

    // Set number in the EOA to verify behavior.
    const newNumber = 777;
    await eoaAsWallet.setNumber(newNumber);

    // Verify the number was changed.
    const updatedNumber = await eoaAsWallet.getNumber();
    expect(updatedNumber).to.equal(newNumber);
  });

  // it should set EOA account code as an ERC-7579 Modular Account
  it.only("should set EOA account code as an ERC-7579 Modular Account", async function () {
    const auth = await experimentalEoa.authorize({
      address: await modularAccount.getAddress(),
    });

    const tx = await deployer.sendTransaction({
      type: 4, // EIP-7702 transaction type
      to: experimentalEthers.ZeroAddress,
      authorizationList: [auth],
    });
    await tx.wait();

    const eoaAsModularAccount = modularAccount.connect(eoa);

    // install counter module
    const counterModuleAddr = await counterModule.getAddress();
    const initData = "10";
    const tx = await eoaAsModularAccount.installModule(
      MODULE_TYPE_EXECUTOR,
      counterModuleAddr,
      initData
    );
  });
});
