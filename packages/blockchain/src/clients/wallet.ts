import { generatePrivateKey, privateKeyToAccount, type PrivateKeyAccount } from 'viem/accounts';
import { createLogger } from '@cartel/shared';

const logger = createLogger('wallet');

export interface WalletInfo {
  address: `0x${string}`;
  privateKey: `0x${string}`;
}

/**
 * Generate a new random wallet
 */
export function generateWallet(): WalletInfo {
  const privateKey = generatePrivateKey();
  const account = privateKeyToAccount(privateKey);

  logger.info('Generated new wallet', { address: account.address });

  return {
    address: account.address,
    privateKey,
  };
}

/**
 * Get account from private key
 */
export function getAccount(privateKey: string): PrivateKeyAccount {
  const formattedKey = privateKey.startsWith('0x')
    ? (privateKey as `0x${string}`)
    : (`0x${privateKey}` as `0x${string}`);

  return privateKeyToAccount(formattedKey);
}

/**
 * Validate a private key format
 */
export function isValidPrivateKey(privateKey: string): boolean {
  const key = privateKey.replace('0x', '');
  return /^[0-9a-fA-F]{64}$/.test(key);
}

/**
 * Validate an address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[0-9a-fA-F]{40}$/.test(address);
}

/**
 * Derive multiple wallets from a seed
 * (Simple sequential derivation for demo purposes)
 */
export function deriveWallets(count: number): WalletInfo[] {
  const wallets: WalletInfo[] = [];

  for (let i = 0; i < count; i++) {
    wallets.push(generateWallet());
  }

  logger.info(`Derived ${count} wallets`);
  return wallets;
}
