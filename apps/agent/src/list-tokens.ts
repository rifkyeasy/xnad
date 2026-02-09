/**
 * List tokens from nad.fun testnet
 * Shows available tokens and their prices
 */

import { initSDK, formatEther } from '@nadfun/sdk';
import { ENV } from './config.js';

async function main() {
  console.log('=== nad.fun Token Explorer ===\n');

  if (!ENV.PRIVATE_KEY) {
    console.error('PRIVATE_KEY not set');
    process.exit(1);
  }

  const sdk = initSDK({
    rpcUrl: ENV.RPC_URL,
    privateKey: ENV.PRIVATE_KEY as `0x${string}`,
    network: 'testnet',
  });

  console.log(`Wallet: ${sdk.account.address}`);

  const balance = await sdk.publicClient.getBalance({
    address: sdk.account.address,
  });
  console.log(`Balance: ${formatEther(balance)} MON\n`);

  // List some example tokens (you can add your own)
  const tokens = [
    // The token we just created
    '0xfDB4DC8BFd39515762Dca9C671701E68F5297777',
  ];

  console.log('--- Token Info ---\n');

  for (const token of tokens) {
    try {
      const metadata = await sdk.getMetadata(token as `0x${string}`);
      const isGraduated = await sdk.isGraduated(token as `0x${string}`);
      const progress = await sdk.getProgress(token as `0x${string}`);

      console.log(`Token: ${metadata.symbol} (${metadata.name})`);
      console.log(`Address: ${token}`);
      console.log(`Total Supply: ${formatEther(metadata.totalSupply)}`);
      console.log(`Graduated: ${isGraduated}`);
      console.log(`Progress: ${Number(progress) / 100}%`);

      // Get quote for buying 0.01 MON worth
      try {
        const quote = await sdk.getAmountOut(
          token as `0x${string}`,
          BigInt(10000000000000000), // 0.01 MON
          true
        );
        console.log(`Price (0.01 MON → tokens): ${formatEther(quote.amount)}`);
        console.log(`Router: ${quote.router}`);
      } catch {
        console.log(`Price: Unable to get quote`);
      }

      // Get user balance
      const tokenBalance = await sdk.getBalance(token as `0x${string}`);
      console.log(`Your Balance: ${formatEther(tokenBalance)}`);

      console.log('');
    } catch (error) {
      console.log(`Token ${token}: Error fetching info`);
      console.error(error);
    }
  }

  console.log('--- Fee Config ---');
  const fees = await sdk.getFeeConfig();
  console.log(`Deploy Fee: ${formatEther(fees.deployFeeAmount)} MON`);
  console.log(`Graduate Fee: ${formatEther(fees.graduateFeeAmount)} MON`);
  console.log(`Protocol Fee: ${fees.protocolFee / 100}%`);
}

main().catch(console.error);
