/**
 * Test script for nad.fun token creation on testnet
 */

import { getNadFunClient } from './nadfun-client.js';
import { ENV } from './config.js';

async function main() {
  console.log('=== nad.fun SDK Test ===\n');

  if (!ENV.PRIVATE_KEY) {
    console.error('PRIVATE_KEY not set in environment');
    process.exit(1);
  }

  const client = getNadFunClient();

  console.log(`Wallet Address: ${client.walletAddress}`);

  // Get MON balance
  const balance = await client.getMonBalance();
  console.log(`MON Balance: ${balance} MON\n`);

  // Get deploy fee
  const deployFee = await client.getDeployFee();
  console.log(`Deploy Fee: ${deployFee} MON\n`);

  // Check if we have enough balance
  if (parseFloat(balance) < parseFloat(deployFee) + 0.01) {
    console.log('Not enough MON to create token. Need at least', deployFee, '+ 0.01 MON');
    console.log('Get testnet MON from faucet first.');
    return;
  }

  // Create a test token
  console.log('Creating test token...\n');

  try {
    const result = await client.createToken({
      name: 'Test Agent Token',
      symbol: 'TAGT',
      description: 'A test token created by the xnad agent on nad.fun testnet',
      imagePath: 'test-image.png', // Use local test image
      initialBuyAmount: '0.01', // Small initial buy
    });

    console.log('\n=== Token Created Successfully! ===');
    console.log(`Token Address: ${result.tokenAddress}`);
    console.log(`Pool Address: ${result.poolAddress}`);
    console.log(`TX Hash: ${result.txHash}`);
    console.log(`\nView on explorer: https://testnet.monadexplorer.com/tx/${result.txHash}`);
  } catch (error) {
    console.error('\nToken creation failed:', error);
  }
}

main().catch(console.error);
