import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'XNad - AI Trading Agent',
    short_name: 'XNad',
    description:
      'AI-powered social trading agent for nad.fun on Monad. Analyze your X profile and let AI trade for you.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
