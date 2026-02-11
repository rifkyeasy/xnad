'use client';

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from '@heroui/navbar';
import { Link } from '@heroui/link';
import { link as linkStyles } from '@heroui/theme';
import { Chip } from '@heroui/chip';
import { Tooltip } from '@heroui/tooltip';
import NextLink from 'next/link';
import clsx from 'clsx';
import { useChainId } from 'wagmi';
import Image from 'next/image';

import { siteConfig } from '@/config/site';
import { MONAD_TESTNET } from '@/config/contracts';
import { ThemeSwitch } from '@/components/theme-switch';
import { WalletButton } from '@/components/wallet-button';
import { GithubIcon, TwitterIcon } from '@/components/icons';

export const Navbar = () => {
  const chainId = useChainId();
  const isTestnet = chainId === MONAD_TESTNET.id;

  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      {/* Left: Brand + Desktop nav links */}
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-2" href="/">
            <Image alt="logo" height={35} src={'/android-chrome-192x192.png'} width={35} />
            <p className="font-bold text-inherit">XNad</p>
            {isTestnet && (
              <Tooltip content="Connected to Monad Testnet. Get MON from faucet.">
                <Link isExternal className="no-underline" href={MONAD_TESTNET.faucetUrl}>
                  <Chip color="secondary" size="sm" variant="flat">
                    Testnet
                  </Chip>
                </Link>
              </Tooltip>
            )}
          </NextLink>
        </NavbarBrand>
        <ul className="hidden md:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium'
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      {/* Right: Desktop icons + wallet */}
      <NavbarContent className="hidden md:flex basis-1/5 md:basis-full" justify="end">
        <NavbarItem className="hidden md:flex gap-2">
          <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
            <TwitterIcon className="text-default-500" />
          </Link>
          <Link isExternal aria-label="Github" href={siteConfig.links.github}>
            <GithubIcon className="text-default-500" />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem>
          <WalletButton />
        </NavbarItem>
      </NavbarContent>

      {/* Right: Mobile wallet + hamburger */}
      <NavbarContent className="md:hidden basis-1 pl-4" justify="end">
        <WalletButton />
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      {/* Mobile menu dropdown */}
      <NavbarMenu>
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link color="foreground" href={item.href} size="lg">
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
          <NavbarMenuItem>
            <div className="flex gap-3 mt-4">
              <Link isExternal aria-label="Twitter" href={siteConfig.links.twitter}>
                <TwitterIcon className="text-default-500" />
              </Link>
              <Link isExternal aria-label="Github" href={siteConfig.links.github}>
                <GithubIcon className="text-default-500" />
              </Link>
            </div>
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
