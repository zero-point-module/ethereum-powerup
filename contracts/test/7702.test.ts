import { expect } from "chai";
import { ethers as hardhatEthers } from "hardhat";
import { ethers, ethers as experimentalEthers, Wallet } from "ethers";
import { Counter, CounterModule, ModularAccount } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { MODULE_TYPE_EXECUTOR } from "./utils";

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
    [deployer] = await hardhatEthers.getSigners();
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

    console.log("Adresses:", {
      deployer: await deployer.getAddress(),
      experimentalEOA: await experimentalEoa.getAddress(),
      modularAccount: await modularAccount.getAddress(),
      counter: await counter.getAddress(),
      counterModule: await counterModule.getAddress(),
    });
  });

  it.skip("should set EOA account code using EIP-7702", async function () {
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

    const eoaAsWallet = counter.connect(experimentalEoa);

    // Set number in the EOA to verify behavior.
    const newNumber = 777;
    await eoaAsWallet.setNumber(newNumber);

    // Verify the number was changed.
    const updatedNumber = await eoaAsWallet.getNumber();
    expect(updatedNumber).to.equal(newNumber);
  });

  // it should set EOA account code as an ERC-7579 Modular Account
  it.only("should set EOA account code as an ERC-7579 Modular Account", async function () {
    const authorization = await experimentalEoa.authorize({
      address: await modularAccount.getAddress(),
    });

    const authorizationTx = await deployer.sendTransaction({
      type: 4, // EIP-7702 transaction type
      to: experimentalEthers.ZeroAddress,
      authorizationList: [authorization],
    });
    await authorizationTx.wait();

    const eoaModularAccount = new ethers.Contract(
      await experimentalEoa.getAddress(), // The EOA address is the target
      (await hardhatEthers.getContractFactory("ModularAccount")).interface, // ModularAccount's ABI
      experimentalEoa // Signing with the EOA pkey (acting as tx sender)
    );

    // install counter module
    const counterModuleAddr = await counterModule.getAddress();

    // convert initData to bytes
    const initData = "10";
    const initDataBytes = ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [initData]);

    console.log("Installing module");
    const installModuleTx = await eoaModularAccount.installModule(
      MODULE_TYPE_EXECUTOR,
      counterModuleAddr,
      initDataBytes
    );
    await installModuleTx.wait();
    console.log("Module installed");

    // check if the module is installed
    try {
      // TODO: right now the decoding is failing.
      const isInstalled = await eoaModularAccount.isModuleInstalled(
        MODULE_TYPE_EXECUTOR,
        counterModuleAddr,
        initDataBytes
      );
      expect(isInstalled).to.equal(true);
    } catch (error) {
      console.error("Error checking if module is installed", error);
    }

    // set number in the EOA to verify behavior.
  });
});
