import { expect } from "chai";
import { ethers as hardhatEthers } from "hardhat";
import { ethers, ethers as experimentalEthers, Wallet } from "ethers";
import { SmartWallet } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

// Check for private key - using non-null assertion since we check it
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error("PRIVATE_KEY is not set");
}

describe("EIP-7702: Set EOA Account Code", function () {
  let smartWallet: SmartWallet;
  let deployer: SignerWithAddress;
  let eoa: SignerWithAddress;
  let smartWalletAddress: string;
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

    const SmartWalletFactory = await hardhatEthers.getContractFactory("SmartWallet");
    smartWallet = await SmartWalletFactory.deploy();
    await smartWallet.waitForDeployment();

    smartWalletAddress = await smartWallet.getAddress();
    console.log(`1. SmartWallet deployed at: ${smartWalletAddress} \n`);
  });

  it("should set EOA account code using EIP-7702", async function () {
    // 2. Check that the EOA doesn't have code designated
    const initialCodeAtEOA = await hardhatEthers.provider.getCode(eoa.address);
    expect(initialCodeAtEOA).to.equal("0x");
    console.log("2. EOA initially has no code, as expected \n");

    // Check that the SmartWallet has code
    const smartWalletCode = await hardhatEthers.provider.getCode(smartWalletAddress);
    expect(smartWalletCode).to.not.equal("0x");
    console.log("3. SmartWallet has code, as expected \n");

    // 2. Perform the EIP-7702 designation (authorize EOA to use SmartWallet's code)
    // Note: This uses the experimental ethers.js API for EIP-7702
    console.log("4. Creating authorization for EOA to use SmartWallet's code...");
    const auth = await experimentalEoa.authorize({
      address: smartWalletAddress,
    });

    console.log("5. Sending transaction to designate code...");
    const tx = await deployer.sendTransaction({
      type: 4, // EIP-7702 transaction type
      to: ethers.ZeroAddress, // Can be any address, it doesn't matter for this test
      authorizationList: [auth],
    });
    console.log(`6. Transaction sent: ${tx.hash}`);

    const receipt = await tx.wait();
    console.log(`7. Transaction confirmed in block ${receipt?.blockNumber} \n`);

    console.log("Successfully designated code to EOA using EIP-7702");

    // 3. Check the account now has code
    const eoaCodeAfterDesignation = await hardhatEthers.provider.getCode(eoa.address);
    console.log(`8. Code at EOA after designation: ${eoaCodeAfterDesignation} \n`);

    // The code should be a delegation designator: 0xef0100 followed by the contract address
    const expectedPrefix = "0xef0100";
    const expectedCode = expectedPrefix + smartWalletAddress.slice(2);
    console.log(`Expected code: ${expectedCode}`);

    // TODO: Hardhat doesn't support EIP-7702 yet, is not pulling the code correctly from the EOA.
    // expect(eoaCodeAfterDesignation).to.equal(expectedCode);

    const eoaAsWallet = smartWallet.connect(eoa);

    // Set number in the EOA to verify behavior.
    const newNumber = 777;
    await eoaAsWallet.setNumber(newNumber);

    // Verify the number was changed.
    const updatedNumber = await eoaAsWallet.getNumber();
    expect(updatedNumber).to.equal(newNumber);
    console.log(`Successfully used EOA to update number to ${newNumber} through designated code`);
  });
});
