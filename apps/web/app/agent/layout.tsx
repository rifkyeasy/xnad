import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Agent',
  description:
    'Set up your personalized AI trading strategy based on your X profile. Get automated trading with stop-loss, take-profit, and auto-rebalancing on Monad.',
  openGraph: {
    title: 'AI Agent - XNad',
    description:
      'Set up your personalized AI trading strategy based on your X profile. Automated trading on Monad.',
  },
  twitter: {
    title: 'AI Agent - XNad',
    description:
      'Set up your personalized AI trading strategy based on your X profile. Automated trading on Monad.',
  },
};

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return children;
}
