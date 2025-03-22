// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title SmartWallet
 * @dev A very simple smart wallet with basic number storage functionality
 */
contract SmartWallet {
    // State variable to store our number
    uint256 private _storedNumber;

    // Events
    event NumberChanged(uint256 oldNumber, uint256 newNumber);

    /**
     * @dev Returns the currently stored number
     * @return The stored number value
     */
    function getNumber() public view returns (uint256) {
        return _storedNumber;
    }

    /**
     * @dev Sets a new number value
     * @param newNumber The new number to store
     */
    function setNumber(uint256 newNumber) public {
        uint256 oldNumber = _storedNumber;
        _storedNumber = newNumber;
        emit NumberChanged(oldNumber, newNumber);
    }
}
