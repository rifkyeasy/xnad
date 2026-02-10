# @xnad/contracts

Solidity smart contracts for vault-based automated trading on Monad, built with Foundry.

## Contracts

### VaultFactory

Factory contract that creates one `UserVault` per user address.

- Creates vaults via `createVault()` or `createVaultFor(address)`
- Tracks all vaults in a registry
- Configurable default agent address
- Emits `VaultCreated` events for indexing

### UserVault

Personal vault where users deposit MON and an authorized agent trades on their behalf.

- **Deposit** - Users send MON to the vault
- **Trade** - Agent calls `executeTrade()` to buy/sell on nad.fun bonding curves
- **Strategy** - Three types: Conservative (0), Balanced (1), Aggressive (2)
- **Pause** - Owner can pause/unpause trading
- **Withdraw** - Owner can withdraw funds at any time

All actions emit events: `Deposited`, `Withdrawn`, `TradeExecuted`, `StrategyUpdated`, `Paused`, `AgentUpdated`

## Deployment

Deployed on Monad Testnet (Chain ID: 10143):
- **VaultFactory**: `0x164B4eF50c0C8C75Dc6F571e62731C4Fa0C6283A`

## Usage

```bash
# Build contracts
forge build

# Run tests
forge test

# Gas report
forge test --gas-report

# Deploy to local
forge script script/Deploy.s.sol --rpc-url http://localhost:8545 --broadcast

# Deploy to Monad testnet
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast --verify
```

## Dependencies

- Solidity ^0.8.20
- [Foundry](https://book.getfoundry.sh/) (forge, cast, anvil)
