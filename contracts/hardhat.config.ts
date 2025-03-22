import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const sepoliaRpcUrl = process.env.SEPOLIA_RPC_URL;
if (!sepoliaRpcUrl) {
  throw new Error("SEPOLIA_RPC_URL is not set");
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
        blockNumber: 7500000,
      },
    },
  },
};

export default config;
