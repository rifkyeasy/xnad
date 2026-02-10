/**
 * Create DRA Token on nad.fun
 */

import { getNadFunClient } from './nadfun-client.js';

async function main() {
  console.log('='.repeat(60));
  console.log('Creating DRA Token on nad.fun (Monad Testnet)');
  console.log('='.repeat(60));

  const client = getNadFunClient();

  // Check balance first
  const balance = await client.getMonBalance();
  console.log(`\nWallet: ${client.walletAddress}`);
  console.log(`MON Balance: ${balance}`);

  // Get deploy fee
  const deployFee = await client.getDeployFee();
  console.log(`Deploy Fee: ${deployFee} MON`);

  const tokenParams = {
    name: 'Draliens',
    symbol: 'DRA',
    description: 'DRA - The Draliens community token on Monad. Join the alien invasion of the blockchain.',
    imagePath: './dra.png',
    initialBuyAmount: '0.01',
  };

  console.log(`\nCreating ${tokenParams.symbol}...`);
  console.log(`Name: ${tokenParams.name}`);
  console.log(`Description: ${tokenParams.description}`);
  console.log(`Initial Buy: ${tokenParams.initialBuyAmount} MON`);

  try {
    const result = await client.createToken(tokenParams);

    console.log('\n' + '='.repeat(60));
    console.log('TOKEN CREATED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log(`Token Address: ${result.tokenAddress}`);
    console.log(`Pool Address: ${result.poolAddress}`);
    console.log(`TX Hash: ${result.txHash}`);
    console.log(`\nView on nad.fun: https://testnet.nad.fun/token/${result.tokenAddress}`);

    // Output for config
    console.log('\n--- Add to TESTNET_TOKENS in config ---');
    console.log(`dra: '${result.tokenAddress}',`);
  } catch (error) {
    console.error('Failed to create token:', error);
  }

  // Final balance
  const finalBalance = await client.getMonBalance();
  console.log(`\nFinal MON Balance: ${finalBalance}`);
}

main().catch(console.error);
