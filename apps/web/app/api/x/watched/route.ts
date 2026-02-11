import { NextResponse } from 'next/server';

const WATCHED_ACCOUNTS = ['MugiwaraOneup', 'DraliensNFT'];

interface XProfile {
  name: string;
  username: string;
  userId: string;
  avatar: string;
  createdAt: string;
}

// In-memory cache
const profileCache = new Map<string, { data: XProfile; timestamp: number }>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

async function fetchProfile(username: string): Promise<XProfile | null> {
  const cleanUsername = username.toLowerCase();

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
    });

    if (!res.ok) return null;

    const data = await res.json();
    const profile: XProfile = {
      name: data.name || username,
      username: data.username || cleanUsername,
      userId: data.userId || '',
      avatar: data.avatar || '',
      createdAt: data.createdAt || '',
    };

    profileCache.set(cleanUsername, { data: profile, timestamp: Date.now() });

    return profile;
  } catch {
    return null;
  }
}

export async function GET() {
  const profiles: XProfile[] = [];

  for (const username of WATCHED_ACCOUNTS) {
    const profile = await fetchProfile(username);

    if (profile) {
      profiles.push(profile);
    }
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 150));
  }

  return NextResponse.json(profiles);
}
