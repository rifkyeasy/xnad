// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {VaultFactory} from "../src/VaultFactory.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        // Get deployer private key from env
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address agentAddress = vm.envAddress("AGENT_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        // Deploy VaultFactory with agent address
        VaultFactory factory = new VaultFactory(agentAddress);

        console.log("VaultFactory deployed at:", address(factory));
        console.log("Default agent:", agentAddress);

        vm.stopBroadcast();
    }
}
