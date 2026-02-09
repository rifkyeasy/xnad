// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/MockToken.sol";

/**
 * @title DeployMockTokens
 * @notice Deploys mock tokens for testnet development
 *
 * Usage:
 * forge script script/DeployMockTokens.s.sol:DeployMockTokens --rpc-url $RPC_URL --broadcast --private-key $DEPLOYER_PRIVATE_KEY
 */
contract DeployMockTokens is Script {
    struct TokenConfig {
        string name;
        string symbol;
        uint256 initialSupply;
    }

    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        TokenConfig[5] memory tokens = [
            TokenConfig("Monad Token", "MONAD", 1_000_000_000),
            TokenConfig("Nads Token", "NADS", 500_000_000),
            TokenConfig("Degen Mode", "DEGEN", 420_000_000),
            TokenConfig("Purple Pill", "PURP", 100_000_000),
            TokenConfig("Monad Chad", "CHAD", 69_000_000)
        ];

        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying Mock Tokens...\n");

        for (uint256 i = 0; i < tokens.length; i++) {
            MockToken token = new MockToken(
                tokens[i].name,
                tokens[i].symbol,
                tokens[i].initialSupply
            );
            console.log("%s (%s): %s", tokens[i].name, tokens[i].symbol, address(token));
        }

        console.log("\nMock tokens deployed successfully!");
        console.log("Update MOCK_TOKENS in apps/agent/src/mock-data.ts with these addresses");

        vm.stopBroadcast();
    }
}
