// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {UserVault} from "./UserVault.sol";

/// @title VaultFactory
/// @notice Factory contract for creating UserVault instances
/// @dev Creates one vault per user address
contract VaultFactory {
    // Default agent address for new vaults
    address public defaultAgent;

    // Owner of the factory (can update default agent)
    address public owner;

    // Mapping of user address to their vault
    mapping(address => address) public userVaults;

    // Array of all vaults created
    address[] public allVaults;

    // Events
    event VaultCreated(address indexed user, address indexed vault);
    event DefaultAgentUpdated(address indexed oldAgent, address indexed newAgent);
    event OwnerUpdated(address indexed oldOwner, address indexed newOwner);

    modifier onlyOwner() {
        require(msg.sender == owner, "VaultFactory: not owner");
        _;
    }

    constructor(address _defaultAgent) {
        owner = msg.sender;
        defaultAgent = _defaultAgent;
    }

    /// @notice Create a vault for the caller
    /// @return vault The address of the newly created vault
    function createVault() external returns (address vault) {
        return _createVault(msg.sender);
    }

    /// @notice Create a vault for a specific user (owner only)
    /// @param user The user address to create vault for
    /// @return vault The address of the newly created vault
    function createVaultFor(address user) external onlyOwner returns (address vault) {
        return _createVault(user);
    }

    /// @notice Internal function to create vault
    function _createVault(address user) internal returns (address vault) {
        require(userVaults[user] == address(0), "VaultFactory: vault exists");
        require(user != address(0), "VaultFactory: zero address");

        // Create new vault with user as owner and default agent
        UserVault newVault = new UserVault(user, defaultAgent);
        vault = address(newVault);

        userVaults[user] = vault;
        allVaults.push(vault);

        emit VaultCreated(user, vault);
        return vault;
    }

    /// @notice Get vault address for a user
    /// @param user The user address
    /// @return The vault address (or zero if none)
    function getVault(address user) external view returns (address) {
        return userVaults[user];
    }

    /// @notice Check if user has a vault
    /// @param user The user address
    /// @return True if user has a vault
    function hasVault(address user) external view returns (bool) {
        return userVaults[user] != address(0);
    }

    /// @notice Get total number of vaults created
    /// @return The number of vaults
    function totalVaults() external view returns (uint256) {
        return allVaults.length;
    }

    /// @notice Get vault at index
    /// @param index The index in allVaults array
    /// @return The vault address
    function getVaultAt(uint256 index) external view returns (address) {
        require(index < allVaults.length, "VaultFactory: index out of bounds");
        return allVaults[index];
    }

    /// @notice Update the default agent for new vaults
    /// @param _newAgent The new default agent address
    function setDefaultAgent(address _newAgent) external onlyOwner {
        address oldAgent = defaultAgent;
        defaultAgent = _newAgent;
        emit DefaultAgentUpdated(oldAgent, _newAgent);
    }

    /// @notice Transfer factory ownership
    /// @param _newOwner The new owner address
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "VaultFactory: zero address");
        address oldOwner = owner;
        owner = _newOwner;
        emit OwnerUpdated(oldOwner, _newOwner);
    }
}
