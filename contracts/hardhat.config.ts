import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "@matterlabs/hardhat-zksync-deploy";
import "@matterlabs/hardhat-zksync-solc";
import "@matterlabs/hardhat-zksync-verify";

import "dotenv/config";

// Get private key from environment variable
const privateKeyRelayer = process.env.PRIVATE_KEY_RELAYER;
if (!privateKeyRelayer) {
  throw new Error("PRIVATE_KEY_RELAYER is not set");
}

const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL;
if (!sepoliaRpcUrl) {
  throw new Error("SEPOLIA_RPC_URL is not set");
}

const mantleSepoliaRpcUrl = process.env.MANTLE_SEPOLIA_RPC_URL;
if (!mantleSepoliaRpcUrl) {
  throw new Error("MANTLE_SEPOLIA_RPC_URL is not set");
}

const worldchainSepoliaRpcUrl = process.env.WORLDCHAIN_SEPOLIA_RPC_URL;
if (!worldchainSepoliaRpcUrl) {
  throw new Error("WORLDCHAIN_SEPOLIA_RPC_URL is not set");
}

const zksyncSepoliaRpcUrl = process.env.ZKSYNC_SEPOLIA_RPC_URL;
if (!zksyncSepoliaRpcUrl) {
  throw new Error("ZKSYNC_SEPOLIA_RPC_URL is not set");
}

const optimismSepoliaRpcUrl = process.env.OPTIMISM_SEPOLIA_RPC_URL;
if (!optimismSepoliaRpcUrl) {
  throw new Error("OPTIMISM_SEPOLIA_RPC_URL is not set");
}

const config: HardhatUserConfig = {
  zksolc: {
    version: "1.5.11", // Use the latest version
    compilerSource: "binary",
    settings: {
      optimizer: {
        enabled: true,
      },
    },
  },

  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "berlin", 
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
      accounts: [privateKeyRelayer],
      chainId: 11155111, // Sepolia chain ID
    },
    worldchain_sepolia: {
      url: worldchainSepoliaRpcUrl,
      accounts: [privateKeyRelayer],
      chainId: 4801,
    },
    optimism_sepolia: {
      url: optimismSepoliaRpcUrl,
      accounts: [privateKeyRelayer],
      chainId: 11155420,
    },
    zksync_sepolia: {
      url: zksyncSepoliaRpcUrl,
      accounts: [privateKeyRelayer],
      chainId: 300,
      zksync: true,
      ethNetwork: "sepolia",
    },
    mantle_sepolia: {
      url: mantleSepoliaRpcUrl,
      accounts: [privateKeyRelayer],
      chainId: 5003,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};

export default config;
