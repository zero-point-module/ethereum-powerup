import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL;
if (!sepoliaRpcUrl) {
  throw new Error("SEPOLIA_RPC_URL is not set");
}

// Get private key from environment variable
const privateKey = process.env.PRIVATE_KEY;
if (!privateKey) {
  throw new Error("PRIVATE_KEY is not set");
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "cancun", // This is the important change
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: sepoliaRpcUrl,
        enabled: true,
      },
    },
    // Add Sepolia network configuration
    sepolia: {
      url: sepoliaRpcUrl,
      accounts: [privateKey],
      chainId: 11155111, // Sepolia chain ID
    },
  },
};

export default config;
