// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../src/SmartLock.sol";

contract SmartLockTest is Test {
    SmartLock smartLock;
    address owner = address(0x1);
    address user = address(0x2);
    bytes32 lockId;

    function setUp() public {
        smartLock = new SmartLock();
        lockId = keccak256(abi.encodePacked("lock001"));

        vm.prank(owner);
        smartLock.registerLock(lockId);
    }

    function testOwnerCanGrantAccess() public {
        vm.prank(owner);
        smartLock.grantAccess(lockId, user);

        bool isAuth = smartLock.isAuthorized(lockId, user);
        assertTrue(isAuth);
    }

    function testUnauthorizedCannotUnlock() public {
        vm.expectRevert("Access denied");

        vm.prank(user);
        smartLock.unlock(lockId);
    }

    function testAuthorizedCanUnlock() public {
        vm.prank(owner);
        smartLock.grantAccess(lockId, user);

        vm.prank(user);
        smartLock.unlock(lockId);
    }

    function testOnOnlyOwnerCanGrantAccess() public {
        vm.expectRevert("Not lock owner");

        vm.prank(user);
        smartLock.grantAccess(lockId, address(0x3));
    }
}