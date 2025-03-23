// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {MODULE_TYPE_HOOK, IERC7579Hook, IERC7579Module} from "@openzeppelin/contracts/interfaces/draft-IERC7579.sol";

contract ERC7579HookMock is IERC7579Hook {
    event ModuleInstalledReceived(address account, bytes data);
    event ModuleUninstalledReceived(address account, bytes data);

    event PreCheck(address sender, uint256 value, bytes data);
    event PostCheck(bytes hookData);

    function onInstall(bytes calldata data) public virtual {
        emit ModuleInstalledReceived(msg.sender, data);
    }

    function onUninstall(bytes calldata data) public virtual {
        emit ModuleUninstalledReceived(msg.sender, data);
    }
    
    function isModuleType(uint256 moduleTypeId) external pure returns (bool) {
        return moduleTypeId == MODULE_TYPE_HOOK;
    }

    function preCheck(
        address msgSender,
        uint256 value,
        bytes calldata msgData
    ) external returns (bytes memory hookData) {
        emit PreCheck(msgSender, value, msgData);
        return msgData;
    }

    function postCheck(bytes calldata hookData) external {
        emit PostCheck(hookData);
    }
}
