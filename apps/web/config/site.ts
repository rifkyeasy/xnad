export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Agent Cartel",
  description: "Coordinated AI agents dominating nad.fun token launches on Monad",
  navItems: [
    {
      label: "Dashboard",
      href: "/",
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
      label: "Trade",
      href: "/trade",
    },
  ],
  links: {
    github: "https://github.com/agent-cartel",
    twitter: "https://twitter.com/agentcartel",
    nadfun: "https://nad.fun",
    monad: "https://monad.xyz",
  },
};
