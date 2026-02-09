import OpenAI from 'openai';
import { StrategyType } from '../db/client.js';
import type { XAnalysis } from '../types/index.js';

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Tweet {
  text: string;
  likes: number;
  retweets: number;
}

// Fetch tweets from X/Twitter
async function fetchTweets(xHandle: string): Promise<Tweet[]> {
  // Get profile ID first
  const profileRes = await fetch(`https://tweethunter.io/api/convert2?inputString=${xHandle}`, {
    headers: {
      accept: '*/*',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
    },
  });

  if (!profileRes.ok) {
    throw new Error(`Failed to get profile for ${xHandle}`);
  }

  const profile = (await profileRes.json()) as { userId: string };

  // Fetch tweets
  const tweetsRes = await fetch(
    `https://twitter241.p.rapidapi.com/user-tweets?user=${profile.userId}&count=20`,
    {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.X_RAPIDAPI_API_KEY || '',
        'x-rapidapi-host': 'twitter241.p.rapidapi.com',
      },
    }
  );

  if (!tweetsRes.ok) {
    throw new Error(`Failed to fetch tweets for ${xHandle}`);
  }

  interface TweetResponse {
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
                      full_text: string;
                      favorite_count: number;
                      retweet_count: number;
                    };
                  };
                };
              };
            };
          }>;
        }>;
      };
    };
  }

  const data = (await tweetsRes.json()) as TweetResponse;
  const tweets: Tweet[] = [];

  const instructions = data.result?.timeline?.instructions || [];
  for (const instruction of instructions) {
    if (instruction.type !== 'TimelineAddEntries') continue;

    for (const entry of instruction.entries || []) {
      const tweetResult = entry.content?.itemContent?.tweet_results?.result;
      if (!tweetResult) continue;

      const legacy = tweetResult.legacy;
      if (!legacy) continue;

      tweets.push({
        text: legacy.full_text,
        likes: legacy.favorite_count,
        retweets: legacy.retweet_count,
      });
    }
  }

  return tweets;
}

// Classify user based on X analysis
function classifyStrategy(analysis: XAnalysis): StrategyType {
  let riskScore = 0;

  // Account maturity
  if (analysis.accountAge > 365) riskScore += 1;
  else if (analysis.accountAge < 90) riskScore -= 1;

  // Crypto involvement
  if (analysis.cryptoMentionRate > 0.5) riskScore += 2;
  else if (analysis.cryptoMentionRate > 0.2) riskScore += 1;

  // Engagement
  if (analysis.engagementRate > 0.05) riskScore += 1;

  // Direct indicators
  if (analysis.riskTolerance === 'high') riskScore += 2;
  else if (analysis.riskTolerance === 'low') riskScore -= 2;

  if (analysis.tradingExperience === 'advanced') riskScore += 1;
  else if (analysis.tradingExperience === 'beginner') riskScore -= 1;

  // Classify
  if (riskScore >= 3) return StrategyType.AGGRESSIVE;
  if (riskScore <= -1) return StrategyType.CONSERVATIVE;
  return StrategyType.BALANCED;
}

// Generate mock X analysis based on handle
function getMockAnalysis(xHandle: string): {
  analysis: XAnalysis;
  recommendedStrategy: StrategyType;
} {
  // Generate deterministic mock data based on handle
  const hash = xHandle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variant = hash % 3;

  const mockAnalyses: Array<{ analysis: XAnalysis; recommendedStrategy: StrategyType }> = [
    {
      analysis: {
        followerCount: 1250,
        followingCount: 420,
        tweetCount: 3500,
        accountAge: 730,
        cryptoMentionRate: 0.15,
        engagementRate: 0.02,
        riskTolerance: 'low',
        tradingExperience: 'beginner',
        interests: ['DeFi', 'NFTs', 'Community', 'Monad'],
        reasoning:
          'Your profile shows cautious engagement with crypto. You prefer established projects and long-term holds. Conservative strategy recommended for steady growth.',
      },
      recommendedStrategy: StrategyType.CONSERVATIVE,
    },
    {
      analysis: {
        followerCount: 5420,
        followingCount: 890,
        tweetCount: 12500,
        accountAge: 540,
        cryptoMentionRate: 0.35,
        engagementRate: 0.04,
        riskTolerance: 'medium',
        tradingExperience: 'intermediate',
        interests: ['Trading', 'Memecoins', 'Monad', 'DeFi'],
        reasoning:
          'Your profile shows active crypto engagement with balanced approach. You follow trends but maintain some caution. Balanced strategy recommended for growth with managed risk.',
      },
      recommendedStrategy: StrategyType.BALANCED,
    },
    {
      analysis: {
        followerCount: 15200,
        followingCount: 2100,
        tweetCount: 45000,
        accountAge: 1095,
        cryptoMentionRate: 0.65,
        engagementRate: 0.08,
        riskTolerance: 'high',
        tradingExperience: 'advanced',
        interests: ['Degen Plays', 'New Launches', 'High Risk', 'Monad'],
        reasoning:
          "Your profile shows degen energy with high activity in new launches. You're comfortable with volatility and chase high returns. Aggressive strategy recommended for maximum upside.",
      },
      recommendedStrategy: StrategyType.AGGRESSIVE,
    },
  ];

  return mockAnalyses[variant];
}

export async function analyzeXAccount(
  xHandle: string
): Promise<{ analysis: XAnalysis; recommendedStrategy: StrategyType }> {
  // Use mock data in testnet mode
  if (USE_MOCK_DATA) {
    console.log(`[MOCK] Analyzing X account @${xHandle}`);
    // Add a small delay to simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    return getMockAnalysis(xHandle);
  }

  // Fetch user's tweets
  const tweets = await fetchTweets(xHandle);

  if (tweets.length === 0) {
    throw new Error('No tweets found for this account');
  }

  // Use AI to analyze the profile
  const prompt = `Analyze this Twitter/X user's profile for crypto trading risk assessment:

Handle: @${xHandle}
Recent Tweets (${tweets.length}):
${tweets
  .slice(0, 10)
  .map((t) => `- ${t.text.substring(0, 200)}`)
  .join('\n')}

Analyze and return JSON only:
{
  "followerCount": estimated number,
  "followingCount": estimated number,
  "tweetCount": ${tweets.length},
  "accountAge": estimated days (365 if unknown),
  "cryptoMentionRate": 0.0 to 1.0 (what % of tweets mention crypto/trading),
  "engagementRate": 0.0 to 0.1 (estimated),
  "riskTolerance": "low" | "medium" | "high",
  "tradingExperience": "beginner" | "intermediate" | "advanced",
  "interests": ["list", "of", "interests"],
  "reasoning": "brief explanation of your assessment"
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    max_tokens: 1024,
    messages: [
      {
        role: 'system',
        content:
          'You analyze social media profiles for crypto trading risk assessment. Return only valid JSON.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('No response from AI');
  }

  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in AI response');
  }

  const analysis = JSON.parse(jsonMatch[0]) as XAnalysis;
  const recommendedStrategy = classifyStrategy(analysis);

  return { analysis, recommendedStrategy };
}
