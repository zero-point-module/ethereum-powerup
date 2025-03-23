// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {AccountERC7579} from "@openzeppelin/community-contracts/contracts/account/extensions/AccountERC7579.sol";
import {AbstractSigner} from "@openzeppelin/community-contracts/contracts/utils/cryptography/AbstractSigner.sol";
import {SignerERC7702} from "@openzeppelin/community-contracts/contracts/utils/cryptography/SignerERC7702.sol";
import {ERC7739} from "@openzeppelin/community-contracts/contracts/utils/cryptography/ERC7739.sol";
import {AccountCore} from "@openzeppelin/community-contracts/contracts/account/AccountCore.sol";
import {PackedUserOperation} from "@openzeppelin/contracts/interfaces/draft-IERC4337.sol";
import {Account} from "@openzeppelin/community-contracts/contracts/account/Account.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "hardhat/console.sol";

// Acknowledgements:
// Source code extracted from OpenZeppelin: https://github.com/OpenZeppelin/openzeppelin-community-contracts
//
contract ModularAccount is Account, AccountERC7579, SignerERC7702 {
    constructor() EIP712("ModularAccount", "1") {}

    function _validateUserOp(
        PackedUserOperation calldata userOp,
        bytes32 userOpHash
    ) internal virtual override(AccountCore, AccountERC7579) returns (uint256) {
        return super._validateUserOp(userOp, userOpHash);
    }

    /// @dev Resolve implementation of ERC-1271 by both ERC7739 and AccountERC7579 to support both schemes.
    function isValidSignature(
        bytes32 hash,
        bytes calldata signature
    ) public view virtual override(ERC7739, AccountERC7579) returns (bytes4) {
        // ERC-7739 can return the fn selector (success), 0xffffffff (invalid) or 0x77390001 (detection).
        // If the return is 0xffffffff, we fallback to validation using ERC-7579 modules.
        bytes4 erc7739magic = ERC7739.isValidSignature(hash, signature);
        return
            erc7739magic == bytes4(0xffffffff)
                ? AccountERC7579.isValidSignature(hash, signature)
                : erc7739magic;
    }

    /// @dev Enable signature using the ERC-7702 signer.
    function _rawSignatureValidation(
        bytes32 hash,
        bytes calldata signature
    )
        internal
        view
        virtual
        override(AbstractSigner, AccountERC7579, SignerERC7702)
        returns (bool)
    {
        return SignerERC7702._rawSignatureValidation(hash, signature);
    }

    function getNumber() public pure returns (uint256) {
        return 1;
    }
}
