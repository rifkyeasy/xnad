import { ENV, SIGNAL_KEYWORDS } from './config.js';
import { log } from './logger.js';

export interface Tweet {
  id: string;
  text: string;
  author: string;
  authorFollowers: number;
  createdAt: string;
  likes: number;
  retweets: number;
  replies: number;
  views: number;
  urls: string[];
}

interface ProfileResponse {
  userId: string;
  username: string;
}

// Get X user profile (username -> userId) via RapidAPI
async function getProfile(username: string): Promise<ProfileResponse> {
  const res = await fetch(
    `https://twitter241.p.rapidapi.com/user?username=${username}`,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-key': ENV.X_RAPIDAPI_KEY,
        'x-rapidapi-host': 'twitter241.p.rapidapi.com',
      },
    }
  );

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Profile lookup failed for @${username} (${res.status}): ${body}`);
  }

  const data = (await res.json()) as {
    result?: { data?: { user?: { result?: { rest_id?: string; legacy?: { screen_name?: string } } } } };
  };
  const userId = data?.result?.data?.user?.result?.rest_id;
  if (!userId) {
    throw new Error(`No userId returned for @${username}`);
  }

  return {
    userId,
    username: data?.result?.data?.user?.result?.legacy?.screen_name || username,
  };
}

// Get recent tweets from a user
export async function getTweets(username: string): Promise<Tweet[]> {
  try {
    const profile = await getProfile(username);

    const res = await fetch(
      `https://twitter241.p.rapidapi.com/user-tweets?user=${profile.userId}&count=20`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-key': ENV.X_RAPIDAPI_KEY,
          'x-rapidapi-host': 'twitter241.p.rapidapi.com',
        },
      }
    );

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`RapidAPI tweets failed for @${username} (${res.status}): ${body}`);
    }

    const data = (await res.json()) as {
      result?: {
        timeline?: {
          instructions?: Array<{
            type: string;
            entries?: Array<{
              content?: {
                itemContent?: {
                  tweet_results?: {
                    result?: {
                      legacy?: {
                        id_str: string;
                        full_text: string;
                        created_at: string;
                        favorite_count: number;
                        retweet_count: number;
                        reply_count: number;
                        entities?: { urls?: Array<{ expanded_url: string }> };
                      };
                      core?: {
                        user_results?: {
                          result?: { legacy?: { followers_count: number } };
                        };
                      };
                      views?: { count: string };
                    };
                  };
                };
              };
            }>;
          }>;
        };
      };
    };
    const tweets: Tweet[] = [];

    // Parse tweets from the response
    const instructions = data.result?.timeline?.instructions || [];
    for (const instruction of instructions) {
      if (instruction.type !== 'TimelineAddEntries') continue;

      for (const entry of instruction.entries || []) {
        const tweetResult = entry.content?.itemContent?.tweet_results?.result;
        if (!tweetResult) continue;

        const legacy = tweetResult.legacy;
        if (!legacy) continue;

        // Extract URLs from the tweet
        const urls: string[] = [];
        for (const url of legacy.entities?.urls || []) {
          urls.push(url.expanded_url);
        }

        tweets.push({
          id: legacy.id_str,
          text: legacy.full_text,
          author: username,
          authorFollowers: tweetResult.core?.user_results?.result?.legacy?.followers_count || 0,
          createdAt: legacy.created_at,
          likes: legacy.favorite_count,
          retweets: legacy.retweet_count,
          replies: legacy.reply_count,
          views: parseInt(tweetResult.views?.count || '0'),
          urls,
        });
      }
    }

    return tweets;
  } catch (error) {
    log.error(`Failed to fetch tweets for @${username}`, error);
    return [];
  }
}

// Filter tweets that might contain trading signals
export function filterSignalTweets(tweets: Tweet[]): Tweet[] {
  return tweets.filter((tweet) => {
    const text = tweet.text.toLowerCase();
    return SIGNAL_KEYWORDS.some((keyword) => text.includes(keyword.toLowerCase()));
  });
}

// Extract potential token addresses from tweet
export function extractTokenAddresses(tweet: Tweet): string[] {
  const addresses: string[] = [];

  // Match Ethereum-style addresses (0x...)
  const addressRegex = /0x[a-fA-F0-9]{40}/g;
  const textMatches = tweet.text.match(addressRegex) || [];
  addresses.push(...textMatches);

  // Also check URLs (might contain token addresses)
  for (const url of tweet.urls) {
    const urlMatches = url.match(addressRegex) || [];
    addresses.push(...urlMatches);

    // Check for nad.fun token URLs
    const nadfunMatch = url.match(/nad\.fun\/token\/(0x[a-fA-F0-9]{40})/);
    if (nadfunMatch) {
      addresses.push(nadfunMatch[1]);
    }
  }

  // Remove duplicates
  return [...new Set(addresses)];
}

// Extract token symbols (e.g., $BTGO)
export function extractTokenSymbols(tweet: Tweet): string[] {
  const symbolRegex = /\$([A-Za-z]{2,10})/g;
  const matches = tweet.text.match(symbolRegex) || [];
  return matches.map((s) => s.replace('$', '').toUpperCase());
}
