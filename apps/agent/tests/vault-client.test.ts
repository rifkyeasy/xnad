/**
 * Vault Client Integration Tests
 * Tests the VaultFactory and UserVault contracts on Monad testnet
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { VaultClient } from '../src/vault-client.js';
import { VAULT_CONTRACTS, ENV } from '../src/config.js';

// Test token created on nad.fun testnet
const TEST_TOKEN = '0xfDB4DC8BFd39515762Dca9C671701E68F5297777';

describe('VaultClient', () => {
  let client: VaultClient;

  beforeAll(() => {
    if (!ENV.PRIVATE_KEY) {
      throw new Error('PRIVATE_KEY required for tests');
    }
    client = new VaultClient(VAULT_CONTRACTS.vaultFactory);
  });

  describe('initialization', () => {
    it('should create client with agent address', () => {
      expect(client.agentAddress).toBeDefined();
      expect(client.agentAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
      console.log(`Agent Address: ${client.agentAddress}`);
    });

    it('should use correct factory address', () => {
      expect(VAULT_CONTRACTS.vaultFactory).toBe('0x164B4eF50c0C8C75Dc6F571e62731C4Fa0C6283A');
      console.log(`Factory Address: ${VAULT_CONTRACTS.vaultFactory}`);
    });
  });

  describe('factory operations', () => {
    it('should get all vaults', async () => {
      const vaults = await client.getAllVaults();
      expect(Array.isArray(vaults)).toBe(true);
      console.log(`Total Vaults: ${vaults.length}`);
      if (vaults.length > 0) {
        console.log(`First Vault: ${vaults[0]}`);
      }
    });

    it('should check if address has vault', async () => {
      // Check if agent address has a vault
      const vaultAddress = await client.getVaultAddress(client.agentAddress);
      console.log(`Agent vault: ${vaultAddress || 'none'}`);
      // This just tests the function works, may or may not have a vault
      expect(vaultAddress === null || typeof vaultAddress === 'string').toBe(true);
    });
  });

  describe('vault info (if vault exists)', () => {
    it('should get vault info for existing vault', async () => {
      const vaults = await client.getAllVaults();

      if (vaults.length === 0) {
        console.log('No vaults exist yet, skipping vault info test');
        return;
      }

      const vaultInfo = await client.getVaultInfo(vaults[0]);
      expect(vaultInfo).not.toBeNull();

      if (vaultInfo) {
        expect(vaultInfo.address).toBe(vaults[0]);
        expect(vaultInfo.owner).toMatch(/^0x[a-fA-F0-9]{40}$/);
        expect(vaultInfo.agent).toMatch(/^0x[a-fA-F0-9]{40}$/);
        expect(typeof vaultInfo.balance).toBe('string');
        expect(typeof vaultInfo.strategyType).toBe('number');
        expect(vaultInfo.strategyType).toBeGreaterThanOrEqual(0);
        expect(vaultInfo.strategyType).toBeLessThanOrEqual(2);

        console.log(`Vault Info:`);
        console.log(`  Address: ${vaultInfo.address}`);
        console.log(`  Owner: ${vaultInfo.owner}`);
        console.log(`  Agent: ${vaultInfo.agent}`);
        console.log(`  Balance: ${vaultInfo.balance} MON`);
        console.log(
          `  Strategy: ${['Conservative', 'Balanced', 'Aggressive'][vaultInfo.strategyType]}`
        );
        console.log(`  Max Trade: ${vaultInfo.maxTradeAmount} MON`);
        console.log(`  Paused: ${vaultInfo.paused}`);
      }
    });

    it('should get token balance in vault', async () => {
      const vaults = await client.getAllVaults();

      if (vaults.length === 0) {
        console.log('No vaults exist yet, skipping token balance test');
        return;
      }

      const balance = await client.getVaultTokenBalance(vaults[0], TEST_TOKEN);
      expect(balance).toBeDefined();
      expect(parseFloat(balance)).toBeGreaterThanOrEqual(0);
      console.log(`Vault Token Balance: ${balance}`);
    });
  });
});
