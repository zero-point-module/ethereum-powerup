// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC7579Module, MODULE_TYPE_EXECUTOR} from "@openzeppelin/contracts/interfaces/draft-IERC7579.sol";

contract CounterModule is IERC7579Module {
    uint256 private constant _moduleTypeId = MODULE_TYPE_EXECUTOR;

    mapping(address account => uint256 number) private _numbers;

    event ModuleInstalledReceived(address account, bytes data);
    event ModuleUninstalledReceived(address account, bytes data);

    function onInstall(bytes calldata data) public virtual {
        // extract number from data
        uint256 number = abi.decode(data, (uint256));
        setNumber(number);

        emit ModuleInstalledReceived(msg.sender, data);
    }

    function onUninstall(bytes calldata data) public virtual {
        emit ModuleUninstalledReceived(msg.sender, data);
    }

    function isModuleType(uint256 moduleTypeId) external pure returns (bool) {
        return moduleTypeId == _moduleTypeId;
    }

    // Counter Module specific functions
    function setNumber(uint256 number) public {
        _numbers[msg.sender] = number;
    }

    function getNumber() public view returns (uint256) {
        return _numbers[msg.sender];
    }
}
