import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trade',
  description:
    'Buy and sell tokens on nad.fun. Trade trending tokens on Monad blockchain with real-time quotes and bonding curve progress tracking.',
  openGraph: {
    title: 'Trade - XNad',
    description:
      'Buy and sell tokens on nad.fun. Trade trending tokens on Monad blockchain with real-time quotes.',
  },
  twitter: {
    title: 'Trade - XNad',
    description:
      'Buy and sell tokens on nad.fun. Trade trending tokens on Monad blockchain with real-time quotes.',
  },
};

export default function TradeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
