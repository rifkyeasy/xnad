/**
 * Create App Tokens on nad.fun
 * Creates tokens for the xnad Social AI Trading Agent
 */

import { getNadFunClient } from './nadfun-client.js';

// App tokens to create
const TOKENS_TO_CREATE = [
  {
    name: 'XNAD Token',
    symbol: 'XNAD',
    description:
      'The official token of XNAD - Social AI Trading Agent on Monad. Powered by AI analysis of X/Twitter signals for automated trading.',
    twitter: 'xnad_ai',
    initialBuyAmount: '0.1',
  },
  {
    name: 'Freezy',
    symbol: 'FREEZY',
    description:
      'Freezy - The coolest AI trading companion on Monad. Let AI freeze your gains and melt your losses.',
    initialBuyAmount: '0.1',
  },
  {
    name: 'Agent AI',
    symbol: 'AGAI',
    description:
      'Agent AI token for the autonomous trading ecosystem. AI-powered social signal detection and execution on Monad.',
    initialBuyAmount: '0.1',
  },
];

async function main() {
  console.log('='.repeat(60));
  console.log('Creating Test Tokens on nad.fun (Monad Testnet)');
  console.log('='.repeat(60));

  const client = getNadFunClient();

  // Check balance first
  const balance = await client.getMonBalance();
  console.log(`\nWallet: ${client.walletAddress}`);
  console.log(`MON Balance: ${balance}`);

  // Get deploy fee
  const deployFee = await client.getDeployFee();
  console.log(`Deploy Fee per Token: ${deployFee} MON`);

  const totalNeeded =
    TOKENS_TO_CREATE.length * parseFloat(deployFee) +
    TOKENS_TO_CREATE.reduce((sum, t) => sum + parseFloat(t.initialBuyAmount || '0'), 0);

  console.log(`Total MON needed: ~${totalNeeded.toFixed(2)} MON`);

  if (parseFloat(balance) < totalNeeded) {
    console.log(
      `\n⚠️  Insufficient balance. Need ${totalNeeded.toFixed(2)} MON but have ${balance} MON`
    );
    console.log(`Creating fewer tokens...`);
  }

  const createdTokens: Array<{ name: string; symbol: string; address: string }> = [];

  for (let i = 0; i < TOKENS_TO_CREATE.length; i++) {
    const tokenParams = TOKENS_TO_CREATE[i];

    // Check remaining balance
    const currentBalance = await client.getMonBalance();
    const needed = parseFloat(deployFee) + parseFloat(tokenParams.initialBuyAmount || '0');

    if (parseFloat(currentBalance) < needed) {
      console.log(
        `\n⚠️  Insufficient balance for ${tokenParams.symbol}. Skipping remaining tokens.`
      );
      break;
    }

    console.log(`\n${'─'.repeat(50)}`);
    console.log(`Creating Token ${i + 1}/${TOKENS_TO_CREATE.length}: ${tokenParams.symbol}`);
    console.log(`${'─'.repeat(50)}`);

    try {
      const result = await client.createToken(tokenParams);
      createdTokens.push({
        name: tokenParams.name,
        symbol: tokenParams.symbol,
        address: result.tokenAddress,
      });

      console.log(`✓ ${tokenParams.symbol} created at ${result.tokenAddress}`);

      // Wait a bit between token creations
      if (i < TOKENS_TO_CREATE.length - 1) {
        console.log('Waiting 5 seconds before next token...');
        await new Promise((r) => setTimeout(r, 5000));
      }
    } catch (error) {
      console.error(`✗ Failed to create ${tokenParams.symbol}:`, error);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));

  if (createdTokens.length === 0) {
    console.log('No tokens were created.');
    console.log('\nTo create tokens, you need at least 10.1 MON per token.');
    console.log('Get testnet MON from: https://faucet.monad.xyz/');
  } else {
    console.log(`Created ${createdTokens.length} tokens:\n`);
    for (const token of createdTokens) {
      console.log(`  ${token.symbol.padEnd(8)} ${token.address}`);
    }

    // Output for .env
    console.log('\n--- Add to .env ---');
    const symbols = createdTokens.map((t) => t.symbol);
    if (symbols.includes('XNAD')) {
      const xnad = createdTokens.find((t) => t.symbol === 'XNAD');
      console.log(`XNAD_TOKEN_ADDRESS=${xnad?.address}`);
    }
    if (symbols.includes('FREEZY')) {
      const freezy = createdTokens.find((t) => t.symbol === 'FREEZY');
      console.log(`FREEZY_TOKEN_ADDRESS=${freezy?.address}`);
    }
    if (symbols.includes('AGAI')) {
      const agai = createdTokens.find((t) => t.symbol === 'AGAI');
      console.log(`AGAI_TOKEN_ADDRESS=${agai?.address}`);
    }

    // Output for config.ts
    console.log('\n--- Add to config.ts ---');
    console.log('export const APP_TOKENS = {');
    for (const token of createdTokens) {
      console.log(`  ${token.symbol.toLowerCase()}: '${token.address}',`);
    }
    console.log('};');
  }

  // Final balance
  const finalBalance = await client.getMonBalance();
  console.log(`\nFinal MON Balance: ${finalBalance}`);
}

main().catch(console.error);
