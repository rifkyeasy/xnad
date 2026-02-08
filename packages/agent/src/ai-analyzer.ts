import OpenAI from "openai";
import { ENV } from "./config.js";
import type { Tweet } from "./x-service.js";

const openai = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
});

export interface TradeSignal {
  action: "buy" | "sell" | "hold";
  tokenAddress?: string;
  tokenSymbol?: string;
  confidence: number; // 0-1
  reasoning: string;
  riskLevel: "low" | "medium" | "high";
  suggestedAmount: string; // in MON
}

export interface TweetAnalysis {
  tweet: Tweet;
  signal: TradeSignal | null;
  summary: string;
}

const SYSTEM_PROMPT = `You are a crypto trading AI agent that analyzes tweets to find trading opportunities on nad.fun (a token launchpad on Monad blockchain).

Your job is to:
1. Analyze the tweet content and author credibility
2. Determine if this is a trading signal (buy/sell/hold)
3. Extract any token addresses or symbols mentioned
4. Assess the risk level and confidence

Consider these factors:
- Author's follower count and credibility
- Tweet engagement (likes, retweets, views)
- Sentiment and tone of the tweet
- Whether it mentions specific tokens or addresses
- If it's an announcement vs opinion vs shill
- Red flags like "not financial advice" disclaimers or too-good-to-be-true claims

Respond in JSON format only.`;

export async function analyzeTweet(tweet: Tweet): Promise<TweetAnalysis> {
  try {
    const userPrompt = `Analyze this tweet for trading signals:

Tweet: "${tweet.text}"
Author: @${tweet.author}
Author Followers: ${tweet.authorFollowers.toLocaleString()}
Likes: ${tweet.likes}
Retweets: ${tweet.retweets}
Views: ${tweet.views}
URLs in tweet: ${tweet.urls.join(", ") || "none"}

Respond with JSON:
{
  "action": "buy" | "sell" | "hold",
  "tokenAddress": "0x... or null if not found",
  "tokenSymbol": "SYMBOL or null",
  "confidence": 0.0 to 1.0,
  "reasoning": "explanation of your analysis",
  "riskLevel": "low" | "medium" | "high",
  "suggestedAmount": "0.01 to 0.1 MON based on confidence"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    // Extract text from response
    const textContent = response.choices[0]?.message?.content;
    if (!textContent) {
      throw new Error("No text response from AI");
    }

    // Parse JSON from response
    const jsonMatch = textContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in AI response");
    }

    const signal = JSON.parse(jsonMatch[0]) as TradeSignal;

    return {
      tweet,
      signal: signal.action !== "hold" ? signal : null,
      summary: signal.reasoning,
    };
  } catch (error) {
    console.error("Error analyzing tweet:", error);
    return {
      tweet,
      signal: null,
      summary: `Analysis failed: ${error}`,
    };
  }
}

export async function analyzeTweets(tweets: Tweet[]): Promise<TweetAnalysis[]> {
  const analyses: TweetAnalysis[] = [];

  for (const tweet of tweets) {
    const analysis = await analyzeTweet(tweet);
    analyses.push(analysis);

    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 500));
  }

  return analyses;
}

// Get actionable signals (buy/sell with high confidence)
export function getActionableSignals(
  analyses: TweetAnalysis[],
  minConfidence: number = 0.7
): TweetAnalysis[] {
  return analyses.filter(
    (a) =>
      a.signal &&
      a.signal.action !== "hold" &&
      a.signal.confidence >= minConfidence &&
      (a.signal.tokenAddress || a.signal.tokenSymbol)
  );
}
