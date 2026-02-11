export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'xnad',
  description: 'Social AI Trading Agent for nad.fun on Monad',
  url: 'https://xnad.fun',
  navItems: [
    {
      label: 'Dashboard',
      href: '/',
    },
    {
      label: 'Agent',
      href: '/agent',
    },
  ],
  navMenuItems: [
    {
      label: 'Dashboard',
      href: '/',
    },
    {
      label: 'Agent',
      href: '/agent',
    },
  ],
  links: {
    github: 'https://github.com/xnad-fun',
    twitter: 'https://twitter.com/xnad_fun',
    xnad: 'https://xnad.fun',
    nadfun: 'https://nad.fun',
    monad: 'https://monad.xyz',
  },
};
