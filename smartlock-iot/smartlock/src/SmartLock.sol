// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SmartLock {
    struct Lock {
        address owner;
        mapping(address => bool) authorized;
        bool exists;
    }

    mapping(bytes32 => Lock) private locks;

    event LockRegistered(bytes32 indexed lockId, address indexed owner);
    event AccessGranted(bytes32 indexed lockId, address indexed user);
    event AccessRevoked(bytes32 indexed lockId, address indexed user);
    event LockAccessed(bytes32 indexed lockId, address indexed, bool succeess);

    modifier onlyOwner(bytes32 lockId) {
        require(locks[lockId].exists, "Lock not found");
        require(msg.sender == locks[lockId].owner, "Not lock owner");   
        _;
    }

    function registerLock(bytes32 lockId) external {
        require(!locks[lockId].exists, "Lock already registered");

        Lock storage lockData = locks[lockId];
        lockData.owner = msg.sender;
        lockData.exists = true;
        lockData.authorized[msg.sender] = true;

        emit LockRegistered(lockId, msg.sender);
    }

    function grantAccess(bytes32 lockId, address user) external onlyOwner(lockId) {
        locks[lockId].authorized[user] = true;
        emit AccessGranted(lockId, user);
    }

    function revokeAccess(bytes32 lockId, address user) external onlyOwner(lockId) {
        locks[lockId].authorized[user] = false;
        emit AccessRevoked(lockId, user);
    }

    function isAuthorized(bytes32 lockId, address user) external view returns (bool) {
        return locks[lockId].authorized[user];
    }

    function unlock(bytes32 lockId) external {
        bool allowed = locks[lockId].authorized[msg.sender];
        emit LockAccessed(lockId, msg.sender, allowed);
        require(allowed, "Access denied");
    }
}