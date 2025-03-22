import type { BaseContract, Contract, ContractRunner } from 'ethers';

export interface EOAUpgradeContract extends BaseContract {
  isUpgraded(address: string): Promise<boolean>;
  getInstalledModules(address: string): Promise<string[]>;
}

export const EOA_UPGRADE_ADDRESS_SEPOLIA = '0x...'; // You'll need to replace this with your deployed contract address

export const EOA_UPGRADE_ABI = [
  'function isUpgraded(address account) view returns (bool)',
  'function getInstalledModules(address account) view returns (string[])',
] as const; 