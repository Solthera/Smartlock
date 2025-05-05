// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/SmartLock.sol";

contract DeploySmartLock is Script {
    function run() external {
        vm.startBroadcast();
        SmartLock smartLock = new SmartLock();
        vm.stopBroadcast();
    }
}