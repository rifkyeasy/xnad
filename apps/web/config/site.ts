export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Freezy",
  description: "Social AI Trading Agent for nad.fun on Monad",
  navItems: [
    {
      label: "Dashboard",
      href: "/",
    },
    {
      label: "Agent",
      href: "/agent",
    },
    {
      label: "Trade",
      href: "/trade",
    },
  ],
  navMenuItems: [
    {
      label: "Dashboard",
      href: "/",
    },
    {
      label: "Agent",
      href: "/agent",
    },
    {
      label: "Trade",
      href: "/trade",
    },
  ],
  links: {
    github: "https://github.com/freezy-app",
    twitter: "https://twitter.com/freezy_app",
    nadfun: "https://nad.fun",
    monad: "https://monad.xyz",
  },
};
