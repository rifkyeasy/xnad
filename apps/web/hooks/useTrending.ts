'use client';

import { useQuery } from '@tanstack/react-query';

export interface TrendingToken {
  address: string;
  name: string;
  symbol: string;
  imageUrl?: string;
  marketCap: number;
  priceChange24h: number;
  volume24h: number;
  holders: number;
  progress: number;
  createdAt: number;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

const FALLBACK_TOKENS: TrendingToken[] = [
  {
    address: '0xFBD84ab1526BfbA7533b1EC2842894eE92777777',
    name: 'Draliens',
    symbol: 'DRA',
    marketCap: 10000,
    priceChange24h: 50.0,
    volume24h: 8000,
    holders: 15,
    progress: 5,
    createdAt: Date.now() - 30 * 60 * 1000,
  },
  {
    address: '0x2F0292D4b34601D97ee7E52b2058f11928B87777',
    name: 'Shramp',
    symbol: 'SHRAMP',
    marketCap: 10000,
    priceChange24h: 25.5,
    volume24h: 5000,
    holders: 10,
    progress: 5,
    createdAt: Date.now() - 1 * 60 * 60 * 1000,
  },
  {
    address: '0x350035555E10d9AfAF1566AaebfCeD5BA6C27777',
    name: 'Chog',
    symbol: 'CHOG',
    marketCap: 746000,
    priceChange24h: 12.5,
    volume24h: 45000,
    holders: 1250,
    progress: 89,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    address: '0x91ce820dD39A2B5639251E8c7837998530Fe7777',
    name: 'Motion',
    symbol: 'MOTION',
    marketCap: 340000,
    priceChange24h: -5.2,
    volume24h: 28000,
    holders: 890,
    progress: 72,
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    address: '0x81A224F8A62f52BdE942dBF23A56df77A10b7777',
    name: 'Emo',
    symbol: 'EMO',
    marketCap: 160000,
    priceChange24h: 28.4,
    volume24h: 52000,
    holders: 620,
    progress: 55,
    createdAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    address: '0x405b6330e213DED490240CbcDD64790806827777',
    name: 'Moncock',
    symbol: 'MONCOCK',
    marketCap: 149000,
    priceChange24h: 45.8,
    volume24h: 38000,
    holders: 445,
    progress: 48,
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    address: '0xB1C0d1a1CC0199D78649EFc40FDe85A080Cd7777',
    name: 'SB Good',
    symbol: 'SBGOOD',
    marketCap: 62000,
    priceChange24h: 8.3,
    volume24h: 12000,
    holders: 320,
    progress: 35,
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
];

async function fetchTrending(): Promise<TrendingToken[]> {
  // Try nad.fun API first
  try {
    const response = await fetch('https://testnet-api.nad.fun/tokens?sort=trending&limit=10');

    if (response.ok) {
      const data = await response.json();

      if (data.tokens?.length > 0) {
        return data.tokens.map((t: Record<string, unknown>) => ({
          address: t.address as string,
          name: t.name as string,
          symbol: t.symbol as string,
          imageUrl: t.imageUrl as string | undefined,
          marketCap: Number(t.marketCap) || 0,
          priceChange24h: Number(t.priceChange24h) || 0,
          volume24h: Number(t.volume24h) || 0,
          holders: Number(t.holders) || 0,
          progress: Number(t.progress) || 0,
          createdAt: Number(t.createdAt) || Date.now(),
        }));
      }
    }
  } catch {
    // fall through
  }

  // Try backend
  try {
    const response = await fetch(`${BACKEND_URL}/api/tokens/trending`);

    if (response.ok) {
      const data = await response.json();

      if (data.length > 0) return data;
    }
  } catch {
    // fall through
  }

  return FALLBACK_TOKENS;
}

export function useTrending() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['trending'],
    queryFn: fetchTrending,
    staleTime: 60 * 1000, // 1 min
  });

  return {
    tokens: data ?? [],
    isLoading,
    error: error?.message ?? null,
  };
}

export function formatMarketCap(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }

  return `$${value.toFixed(0)}`;
}

export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;

  return `${Math.floor(seconds / 86400)}d ago`;
}
