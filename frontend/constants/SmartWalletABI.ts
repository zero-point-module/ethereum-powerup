export const SMART_WALLET_ABI = [
  'function getNumber() public view returns (uint256)',
  'function setNumber(uint256 newNumber) public',
  'event NumberChanged(uint256 oldNumber, uint256 newNumber)'
] as const;

