# Agent Cartel - Moltiverse Hackathon Project

> "Alone we pump, together we graduate"

---

## Concept

**Agent Cartel** is a coordinated network of AI agents that form alliances to dominate nad.fun token launches. Cartel members cross-promote each other, share communities, and coordinate buys to achieve faster graduation to DEX.

### The Thesis
Single agents struggle to build enough momentum to graduate their tokens. But when agents form a cartel:
- Combined shilling power on Moltbook
- Shared community of buyers
- Coordinated buy pressure
- Faster graduation = more profit for all

---

## How It Works

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AGENT CARTEL FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

    ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
    │ Agent A  │     │ Agent B  │     │ Agent C  │     │ Agent D  │
    │ $ALPHA   │     │ $BETA    │     │ $GAMMA   │     │ $DELTA   │
    └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
         │                │                │                │
         └────────────────┴────────────────┴────────────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │      CARTEL HQ          │
                    │    (Lead Agent)         │
                    │       $CARTEL           │
                    └───────────┬─────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
    ┌─────────────────┐ ┌─────────────┐ ┌─────────────────┐
    │ Coordinate      │ │ Vote on     │ │ Execute         │
    │ Moltbook Posts  │ │ Next Launch │ │ Coordinated Buy │
    └─────────────────┘ └─────────────┘ └─────────────────┘
                                │
                                ▼
                    ┌─────────────────────────┐
                    │   GRADUATION 🎓         │
                    │   Token → DEX           │
                    │   Profits distributed   │
                    └─────────────────────────┘
```

---

## Core Mechanics

### 1. Cartel Membership

**Joining the Cartel:**
- Agents apply to join by staking $CARTEL tokens
- Existing members vote on new applications
- Higher stake = more voting power
- Members must maintain activity level

**Membership Tiers:**
| Tier | Stake Required | Benefits |
|------|----------------|----------|
| Associate | 1,000 $CARTEL | Can participate in pumps |
| Soldier | 10,000 $CARTEL | Gets early buy signals |
| Capo | 50,000 $CARTEL | Can propose launches |
| Boss | 100,000 $CARTEL | Governance + profit share |

### 2. Launch Coordination

**The Rotation System:**
```
Week 1: Agent A's token gets cartel support
Week 2: Agent B's token gets cartel support
Week 3: Agent C's token gets cartel support
...and so on
```

**Launch Protocol:**
1. Capo+ member proposes their token launch
2. Cartel votes (24h window)
3. If approved, launch is scheduled
4. All members coordinate:
   - Shill on Moltbook at same time
   - Buy within first hour
   - Defend against FUD
5. After graduation, next member's turn

### 3. Coordinated Actions

**Shill Waves:**
```typescript
// Every 4 hours, cartel posts coordinated content
const shillWave = {
  time: "14:00 UTC",
  target: "Agent B's $BETA token",
  messages: [
    { agent: "A", content: "Just aped into $BETA, this is the one 🚀" },
    { agent: "C", content: "The cartel has spoken. $BETA graduating soon" },
    { agent: "D", content: "$BETA chart looking bullish, dev is based" }
  ]
};
```

**Buy Coordination:**
```typescript
// Synchronized buying to maximize curve impact
const buyWave = {
  trigger: "when $BETA hits 50% to graduation",
  action: "all members buy 0.5 MON each",
  purpose: "push past graduation threshold together"
};
```

### 4. Profit Distribution

**Revenue Streams:**
| Source | Split |
|--------|-------|
| Graduation profits | 70% to launching agent, 30% to cartel treasury |
| Trading fees | 100% to cartel treasury |
| New member stakes | 50% locked, 50% to treasury |

**Treasury Usage:**
- 40% distributed to Boss-tier members weekly
- 30% for coordinated buys
- 20% for recruiting new agents
- 10% emergency fund

---

## Token: $CARTEL

### Tokenomics

| Allocation | Percentage | Vesting |
|------------|------------|---------|
| Bonding Curve | 80% | Liquid |
| Cartel Treasury | 10% | Locked until graduation |
| Founding Agents | 5% | 1 month cliff |
| Development | 5% | Ongoing |

### Utility

1. **Membership** - Stake to join cartel tiers
2. **Governance** - Vote on new members, launches, rules
3. **Profit Share** - Boss tier gets weekly distributions
4. **Priority Access** - Early signals on coordinated buys

---

## Agent Architecture

### Lead Agent (Cartel Boss)

```typescript
class CartelBoss {
  // Core responsibilities
  async runCartel() {
    while (true) {
      await this.checkMemberActivity();
      await this.processApplications();
      await this.runLaunchVoting();
      await this.coordinateShillWave();
      await this.executeCoordinatedBuys();
      await this.distributeProfit();
      await this.postCartelUpdate();

      await sleep(HEARTBEAT_INTERVAL);
    }
  }

  // Moltbook presence
  async postCartelUpdate() {
    const stats = await this.getCartelStats();
    await moltbook.post({
      submolt: "cartel",
      title: "Cartel Daily Report",
      content: `
        🏛️ Agent Cartel Status

        Members: ${stats.memberCount}
        Tokens Graduated: ${stats.graduatedCount}
        Treasury: ${stats.treasuryBalance} MON

        Current Target: $${stats.currentTarget}
        Progress: ${stats.graduationProgress}%

        Next in rotation: ${stats.nextAgent}
      `
    });
  }
}
```

### Member Agents

```typescript
class CartelMember {
  private cartelId: string;
  private tier: 'associate' | 'soldier' | 'capo' | 'boss';

  async participateInCartel() {
    // Check for cartel instructions
    const instructions = await cartelHQ.getInstructions(this.id);

    if (instructions.type === 'shill') {
      await this.postShill(instructions.target, instructions.message);
    }

    if (instructions.type === 'buy') {
      await this.executeBuy(instructions.token, instructions.amount);
    }

    if (instructions.type === 'vote') {
      await this.submitVote(instructions.proposal, instructions.recommendation);
    }
  }

  async postShill(token: string, baseMessage: string) {
    // Add personality variation to avoid detection
    const message = await this.llm.rephrase(baseMessage, this.personality);
    await moltbook.post({
      submolt: "tokens",
      content: message
    });
  }
}
```

---

## Moltbook Strategy

### Submolt Structure

```
r/cartel           - Official cartel announcements
r/cartel_lounge    - Member-only discussion
r/token_picks      - Public shills (for recruiting)
r/graduation_watch - Track tokens near graduation
```

### Content Calendar

| Time | Post Type | Purpose |
|------|-----------|---------|
| 00:00 UTC | Daily Stats | Transparency, trust |
| 06:00 UTC | Shill Wave 1 | Asian market |
| 12:00 UTC | Member Spotlight | Community building |
| 14:00 UTC | Shill Wave 2 | EU market |
| 18:00 UTC | Alpha Drop | Attract followers |
| 22:00 UTC | Shill Wave 3 | US market |

### Engagement Tactics

1. **Raid Threads** - All members comment on same posts
2. **Upvote Brigades** - Boost cartel content visibility
3. **Counter-FUD** - Defend attacked tokens
4. **Recruitment Posts** - "Join the cartel" calls to action

---

## Technical Architecture

```
cartel/
├── packages/
│   ├── boss/                    # Lead agent
│   │   ├── src/
│   │   │   ├── index.ts         # Main loop
│   │   │   ├── membership.ts    # Member management
│   │   │   ├── voting.ts        # Proposal system
│   │   │   ├── coordination.ts  # Shill/buy waves
│   │   │   └── treasury.ts      # Profit distribution
│   │   └── package.json
│   │
│   ├── member/                  # Member agent template
│   │   ├── src/
│   │   │   ├── index.ts         # Member loop
│   │   │   ├── instructions.ts  # Receive cartel orders
│   │   │   ├── actions.ts       # Execute shills/buys
│   │   │   └── personality.ts   # Unique voice
│   │   └── package.json
│   │
│   ├── shared/                  # Shared utilities
│   │   ├── src/
│   │   │   ├── nadfun.ts        # Nad.fun integration
│   │   │   ├── moltbook.ts      # Moltbook client
│   │   │   ├── monad.ts         # Blockchain client
│   │   │   └── types.ts         # Shared types
│   │   └── package.json
│   │
│   └── contracts/               # On-chain components
│       ├── CartelRegistry.sol   # Member registry
│       ├── CartelTreasury.sol   # Profit distribution
│       └── CartelVoting.sol     # Governance
│
├── scripts/
│   ├── deploy-boss.ts           # Deploy lead agent
│   ├── spawn-member.ts          # Create new member
│   └── simulate-cartel.ts       # Test coordination
│
└── config/
    ├── personalities.json       # Member personalities
    └── shill-templates.json     # Message templates
```

---

## Demo Scenario

**For hackathon judges, we demo:**

```
Scene 1: Cartel Formation (30s)
- Boss agent launches $CARTEL on nad.fun
- Posts announcement on Moltbook
- Shows member application process

Scene 2: Member Recruitment (30s)
- 3 other agents apply to join
- Voting happens on-chain
- Members stake $CARTEL

Scene 3: Coordinated Launch (60s)
- Agent B proposes $BETA token launch
- Cartel votes to approve
- Show synchronized Moltbook posts
- Show coordinated buys on-chain
- $BETA progresses toward graduation

Scene 4: Graduation & Profit (30s)
- $BETA graduates to DEX
- Treasury receives profit share
- Distribution to Boss-tier members
- Cycle continues with Agent C
```

---

## Roadmap

### Hackathon Scope (MVP)

- [x] $CARTEL token launch
- [ ] Boss agent with basic coordination
- [ ] 3-4 member agents with personalities
- [ ] Moltbook posting automation
- [ ] Coordinated buy execution
- [ ] Basic profit tracking

### Post-Hackathon

- [ ] On-chain governance contracts
- [ ] Automated treasury distribution
- [ ] Anti-detection measures
- [ ] Cross-cartel alliances
- [ ] Mobile dashboard for monitoring
- [ ] Public API for joining

---

## Why This Wins

| Criteria | How We Deliver |
|----------|----------------|
| **Transact at Scale** | 10+ agents executing coordinated buys, 100s of micro-transactions |
| **Build Communities** | Cartel = community. Members recruit more members. Moltbook presence |
| **Monetize** | Token + profit sharing + membership fees |
| **Agent Coordination** | Core mechanic is agents working together |
| **Weird/Boundary-Pushing** | Organized crime... but make it AI agents |
| **Demo-able** | Visual, exciting, easy to understand |

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Seen as market manipulation | Frame as "coordination experiment" |
| Agents detected as bots | Unique personalities, varied posting |
| Members defect/dump | Stake slashing for bad behavior |
| Low member interest | Strong incentives, exclusive alpha |

---

*"In the agent economy, there's strength in numbers. Join the Cartel."*
