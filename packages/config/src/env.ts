import { z } from 'zod';
import { config } from 'dotenv';

// Load environment variables
config();

const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Blockchain
  PRIVATE_KEY: z.string().min(64, 'Private key must be 64 characters (without 0x prefix)'),
  MONAD_RPC_URL: z.string().url().default('https://testnet-rpc.monad.xyz'),

  // APIs
  NADFUN_API_URL: z.string().url().default('https://dev-api.nad.fun'),
  NADFUN_BOT_API_URL: z.string().url().default('https://testnet-bot-api-server.nad.fun'),
  NADFUN_API_KEY: z.string().optional(),
  MOLTBOOK_API_URL: z.string().url().default('https://www.moltbook.com/api/v1'),
  MOLTBOOK_API_KEY: z.string().optional(),

  // AI
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),

  // Agent Configuration
  AGENT_NAME: z.string().default('CartelBoss'),
  AGENT_PERSONALITY: z.string().default('strategic'),
  CARTEL_ID: z.string().optional(),

  // Feature Flags
  ENABLE_TRADING: z.coerce.boolean().default(false),
  ENABLE_MOLTBOOK: z.coerce.boolean().default(true),
  DRY_RUN: z.coerce.boolean().default(true),
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment configuration');
  }

  return parsed.data;
}

export const env = validateEnv();

export function isProduction(): boolean {
  return env.NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
  return env.NODE_ENV === 'development';
}

export function isTest(): boolean {
  return env.NODE_ENV === 'test';
}
