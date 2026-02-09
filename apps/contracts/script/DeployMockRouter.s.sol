// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {MockBondingCurveRouter} from "../src/MockBondingCurveRouter.sol";

/**
 * @title DeployMockRouter
 * @notice Deploys MockBondingCurveRouter for testnet
 *
 * Usage:
 * forge script script/DeployMockRouter.s.sol:DeployMockRouter --rpc-url $RPC_URL --broadcast --private-key $DEPLOYER_PRIVATE_KEY
 */
contract DeployMockRouter is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying MockBondingCurveRouter...");

        MockBondingCurveRouter router = new MockBondingCurveRouter();
        console.log("MockBondingCurveRouter deployed at:", address(router));

        // Add some initial liquidity for sells to work (0.1 MON)
        (bool success,) = address(router).call{value: 0.1 ether}("");
        if (success) {
            console.log("Added 0.1 MON liquidity");
        } else {
            console.log("Note: Add liquidity manually later");
        }

        console.log("\n=== Update .env with: ===");
        console.log("MOCK_ROUTER_ADDRESS=%s", address(router));

        vm.stopBroadcast();
    }
}
