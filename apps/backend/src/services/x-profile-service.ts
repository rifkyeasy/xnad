/**
 * X Profile Service
 * Fetches X/Twitter profile metadata using tweethunter.io API
 */

import { log } from '../logger.js';

export interface XProfile {
  name: string;
  username: string;
  userId: string;
  avatar: string;
  createdAt: string;
}

// Cache profiles to avoid repeated requests
const profileCache = new Map<string, { data: XProfile; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Get X profile by username
 */
export async function getXProfile(username: string): Promise<XProfile | null> {
  const cleanUsername = username.replace('@', '').toLowerCase();

  // Check cache first
  const cached = profileCache.get(cleanUsername);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  try {
    const res = await fetch(`https://tweethunter.io/api/convert2?inputString=${cleanUsername}`, {
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        Referer: 'https://tweethunter.io/twitter-id-converter',
      },
      method: 'GET',
    });

    if (!res.ok) {
      log.warn(`X profile fetch failed for @${username} (${res.status})`);
      return null;
    }

    const data = (await res.json()) as {
      name?: string;
      username?: string;
      userId?: string;
      avatar?: string;
      createdAt?: string;
    };

    const profile: XProfile = {
      name: data.name || username,
      username: data.username || cleanUsername,
      userId: data.userId || '',
      avatar: data.avatar || '',
      createdAt: data.createdAt || '',
    };

    // Cache the result
    profileCache.set(cleanUsername, { data: profile, timestamp: Date.now() });

    return profile;
  } catch (error) {
    log.error(`Failed to fetch X profile for @${username}`, error);
    return null;
  }
}

/**
 * Get multiple X profiles
 */
export async function getXProfiles(usernames: string[]): Promise<XProfile[]> {
  const profiles: XProfile[] = [];

  for (const username of usernames) {
    const profile = await getXProfile(username);
    if (profile) {
      profiles.push(profile);
    }
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 200));
  }

  return profiles;
}

// Predefined watched accounts for the agent
export const WATCHED_X_ACCOUNTS = ['MugiwaraOneup', 'DraliensNFT'];
