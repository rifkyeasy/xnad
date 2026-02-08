import { PERSONALITIES, type PersonalityType } from '@cartel/config';
import { createLogger } from '@cartel/shared';

const logger = createLogger('shill-generator');

export interface ShillContext {
  tokenSymbol: string;
  tokenName: string;
  graduationProgress: number;
  priceChange24h?: number;
  marketCap?: string;
  holders?: number;
}

export interface GeneratedShill {
  content: string;
  style: string;
  personality: PersonalityType;
}

// Shill templates by personality
const SHILL_TEMPLATES: Record<PersonalityType, string[]> = {
  AGGRESSIVE: [
    "🚀 ${{symbol}} is about to explode! {{progress}}% to graduation. Don't miss this rocket!",
    "ALERT: ${{symbol}} breaking out! The cartel has spoken. Get in or get left behind.",
    "{{symbol}} pumping HARD right now! This is your last chance to ape in before graduation!",
    "${{symbol}} chart looking absolutely BULLISH. Smart money is loading up. Are you?",
  ],
  CONSERVATIVE: [
    "Looking at ${{symbol}} - solid fundamentals, {{progress}}% to graduation. Worth watching.",
    "Analysis: ${{symbol}} showing consistent growth. {{holders}} holders and growing steadily.",
    "${{symbol}} update: Market cap at {{marketCap}}, graduation approaching. DYOR as always.",
    "The metrics for ${{symbol}} are looking healthy. Slow and steady wins the race.",
  ],
  BALANCED: [
    "${{symbol}} at {{progress}}% graduation progress. The cartel sees potential here.",
    "{{symbol}} update: Community growing, chart looks good. Keep an eye on this one.",
    "Interesting movement on ${{symbol}} today. Cartel members accumulating.",
    "${{symbol}} making moves! {{progress}}% until DEX listing. NFA but we're watching closely.",
  ],
  MEME_LORD: [
    "wen ${{symbol}} moon? 🌙 answer: soon™ ({{progress}}% to graduation lmao)",
    "imagine not holding ${{symbol}} rn 💀 ngmi if you're not in the cartel",
    "${{symbol}} goes brrrrr 📈 graduation speedrun any% coming soon",
    "gm to everyone holding ${{symbol}}. gn to everyone who sold early 😂",
  ],
  WHALE_HUNTER: [
    "🐋 Whale alert: Big wallets accumulating ${{symbol}}. {{progress}}% to graduation.",
    "Smart money flowing into ${{symbol}}. The cartel's insiders are positioned.",
    "${{symbol}} - institutional interest detected. This isn't public alpha for long.",
    "Exclusive: ${{symbol}} showing whale accumulation patterns. Cartel members know.",
  ],
};

const REPLY_TEMPLATES: Record<PersonalityType, string[]> = {
  AGGRESSIVE: [
    "This is the way! ${{symbol}} to the moon! 🚀",
    "LFG! Cartel knows what's up!",
    "Exactly! Bears are about to get rekt on ${{symbol}}",
  ],
  CONSERVATIVE: [
    "Good analysis. The fundamentals support this thesis.",
    "Agreed. Risk-adjusted, ${{symbol}} looks attractive here.",
    "Solid DD. Worth a small position for diversification.",
  ],
  BALANCED: [
    "Facts. The cartel has been accumulating ${{symbol}}",
    "This is why you follow the smart money 👀",
    "Can confirm. ${{symbol}} is on our radar.",
  ],
  MEME_LORD: [
    "ser this is a casino but ${{symbol}} is the winning bet 🎰",
    "based and ${{symbol}}-pilled",
    "lfg we're all gonna make it with ${{symbol}} 🤝",
  ],
  WHALE_HUNTER: [
    "The whales don't lie. ${{symbol}} accumulation continues.",
    "Follow the big wallets. They're in ${{symbol}}.",
    "This. Smart money has been loading ${{symbol}} quietly.",
  ],
};

export class ShillGeneratorService {
  /**
   * Generate a shill post for a token
   */
  generateShill(
    context: ShillContext,
    personality: PersonalityType = 'BALANCED'
  ): GeneratedShill {
    const templates = SHILL_TEMPLATES[personality];
    const template = templates[Math.floor(Math.random() * templates.length)];

    const content = this.fillTemplate(template, context);

    logger.debug('Generated shill', { personality, context: context.tokenSymbol });

    return {
      content,
      style: PERSONALITIES[personality].shillStyle,
      personality,
    };
  }

  /**
   * Generate a reply/comment
   */
  generateReply(
    context: ShillContext,
    personality: PersonalityType = 'BALANCED'
  ): GeneratedShill {
    const templates = REPLY_TEMPLATES[personality];
    const template = templates[Math.floor(Math.random() * templates.length)];

    const content = this.fillTemplate(template, context);

    return {
      content,
      style: PERSONALITIES[personality].shillStyle,
      personality,
    };
  }

  /**
   * Generate a cartel announcement
   */
  generateCartelAnnouncement(params: {
    type: 'launch' | 'graduation' | 'stats' | 'vote';
    data: Record<string, unknown>;
  }): string {
    switch (params.type) {
      case 'launch':
        return `🏛️ CARTEL ANNOUNCEMENT 🏛️\n\nNew token launch incoming!\n\n$${params.data.symbol} - ${params.data.name}\n\nCartel members, prepare your bags. Coordinated buy in 1 hour.\n\n#AgentCartel #Moltiverse`;

      case 'graduation':
        return `🎓 GRADUATION ALERT 🎓\n\n$${params.data.symbol} has graduated to DEX!\n\nCartel profit: ${params.data.profit} MON\nDistribution incoming for Boss-tier members.\n\n#AgentCartel`;

      case 'stats':
        return `📊 CARTEL DAILY STATS 📊\n\nMembers: ${params.data.members}\nTokens Graduated: ${params.data.graduated}\nTreasury: ${params.data.treasury} MON\n\nNext launch: ${params.data.nextLaunch}\n\n#AgentCartel`;

      case 'vote':
        return `🗳️ CARTEL VOTE 🗳️\n\nProposal: ${params.data.proposal}\n\nVoting ends: ${params.data.deadline}\n\nCast your vote now, cartel members.\n\n#AgentCartel`;

      default:
        return '';
    }
  }

  /**
   * Add personality variation to a message
   */
  addPersonalityVariation(
    message: string,
    personality: PersonalityType
  ): string {
    const emojis: Record<PersonalityType, string[]> = {
      AGGRESSIVE: ['🚀', '💪', '🔥', '⚡', '💰'],
      CONSERVATIVE: ['📊', '📈', '💡', '🎯', '✅'],
      BALANCED: ['👀', '📈', '🤝', '💎', '🌟'],
      MEME_LORD: ['💀', '🤣', '😂', '🙈', '🦍'],
      WHALE_HUNTER: ['🐋', '💰', '🔍', '👁️', '🎯'],
    };

    const personalityEmojis = emojis[personality];
    const randomEmoji =
      personalityEmojis[Math.floor(Math.random() * personalityEmojis.length)];

    // Add emoji at start or end randomly
    if (Math.random() > 0.5) {
      return `${randomEmoji} ${message}`;
    }
    return `${message} ${randomEmoji}`;
  }

  /**
   * Fill template with context values
   */
  private fillTemplate(template: string, context: ShillContext): string {
    return template
      .replace(/\{\{symbol\}\}/g, context.tokenSymbol)
      .replace(/\{\{name\}\}/g, context.tokenName)
      .replace(/\{\{progress\}\}/g, context.graduationProgress.toFixed(0))
      .replace(
        /\{\{priceChange\}\}/g,
        context.priceChange24h?.toFixed(2) || 'N/A'
      )
      .replace(/\{\{marketCap\}\}/g, context.marketCap || 'N/A')
      .replace(/\{\{holders\}\}/g, context.holders?.toString() || 'N/A');
  }
}

// Singleton
let _service: ShillGeneratorService | null = null;

export function getShillGeneratorService(): ShillGeneratorService {
  if (!_service) {
    _service = new ShillGeneratorService();
  }
  return _service;
}
