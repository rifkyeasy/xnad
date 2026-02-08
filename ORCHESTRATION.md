# Freezy - Project Orchestration

## Dependency Graph

```
                    ┌─────────────────────────────────────────────────────────────────────┐
                    │                         SUBMISSION                                   │
                    │                           P2                                         │
                    │                                                                      │
                    │   ┌───────────────────────────────────────────────────────────────┐ │
                    │   │              freezy-1u8                                       │ │
                    │   │   Create demo video and documentation for submission          │ │
                    │   └───────────────────────────────────────────────────────────────┘ │
                    │                    ▲                    ▲                           │
                    └────────────────────┼────────────────────┼───────────────────────────┘
                                         │                    │
          ┌──────────────────────────────┼────────────────────┼──────────────────────────────┐
          │                 FEATURES     │                    │                               │
          │                   P2         │                    │                               │
          │                              │                    │                               │
          │   ┌──────────────────────────┴───┐    ┌──────────┴─────────────────────────────┐ │
          │   │         freezy-9lt           │    │              freezy-gwm                │ │
          │   │ Integrate Moltbook API       │    │ Implement trading strategy             │ │
          │   └──────────────────────────────┘    └────────────────────────────────────────┘ │
          │                    ▲                             ▲              ▲                │
          └────────────────────┼─────────────────────────────┼──────────────┼────────────────┘
                               │                             │              │
┌──────────────────────────────┼─────────────────────────────┼──────────────┼────────────────┐
│               AGENT CORE     │                             │              │         P1     │
│                              │                             │              │                │
│   ┌──────────────────────────┴─────────────────────────────┴──┐    ┌──────┴─────────────┐ │
│   │                      freezy-vfn                           │    │    freezy-gfs      │ │
│   │            Create main agent orchestration loop           │    │ Launch FREEZY      │ │
│   └───────────────────────────────────────────────────────────┘    │ token on nad.fun   │ │
│                    ▲                           ▲                   └────────────────────┘ │
│                    │                           │                            ▲             │
│   ┌────────────────┴──────────────┐   ┌───────┴────────────────────────┐    │             │
│   │        freezy-9ho             │   │         freezy-t5q             │    │             │
│   │ Build agent tool system       │   │ Implement agent memory         │    │             │
│   └───────────────────────────────┘   └────────────────────────────────┘    │             │
│                ▲           ▲                        ▲                       │             │
│                │           │                        │                       │             │
│   ┌────────────┴───┐   ┌───┴────────────────────────┴─────────────────┐     │             │
│   │  freezy-wn5    │   │              freezy-kor                      │     │             │
│   │ Integrate      │   │ Implement LLM integration layer              │     │             │
│   │ nad.fun SDK    │   │ (OpenAI/Claude)                              │     │             │
│   └────────────────┘   └──────────────────────────────────────────────┘     │             │
│            ▲                              ▲                                 │             │
│            │                              │                                 │             │
│   ┌────────┴───────────────┐              │                                 │             │
│   │     freezy-ehv         │              │                                 │             │
│   │ Create wallet module   ├──────────────┼─────────────────────────────────┘             │
│   │ with ethers.js/viem    │              │                                               │
│   └────────────────────────┘              │                                               │
│            ▲                              │                                               │
└────────────┼──────────────────────────────┼───────────────────────────────────────────────┘
             │                              │
┌────────────┼──────────────────────────────┼───────────────────────────────────────────────┐
│ FOUNDATION │                              │                                        P0     │
│            │                              │                                               │
│   ┌────────┴──────────────────────────────┴────────────────────────────────────────────┐  │
│   │                            freezy-s3y                                              │  │
│   │       Setup TypeScript configuration and linting (ESLint, Prettier)                │  │
│   └────────────────────────────────────────────────────────────────────────────────────┘  │
│                                        ▲                                                  │
│   ┌────────────────────────────────────┴───────────────────────────────────────────────┐  │
│   │                            freezy-5zf                                              │  │
│   │           Initialize monorepo with pnpm workspaces and Turborepo                   │  │
│   └────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                           │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```

## Execution Order

### Phase 1: Foundation (Start Here)
1. `freezy-5zf` - Initialize monorepo with pnpm workspaces and Turborepo
2. `freezy-s3y` - Setup TypeScript configuration and linting

### Phase 2: Core Infrastructure (Parallel Tracks)
**Track A - Blockchain:**
3. `freezy-ehv` - Create wallet management module
4. `freezy-wn5` - Integrate nad.fun SDK

**Track B - AI:**
5. `freezy-kor` - Implement LLM integration layer
6. `freezy-t5q` - Implement agent memory

### Phase 3: Agent Development
7. `freezy-9ho` - Build agent tool system (requires both tracks)
8. `freezy-vfn` - Create main agent orchestration loop
9. `freezy-gfs` - Launch FREEZY token on nad.fun

### Phase 4: Features
10. `freezy-gwm` - Implement trading strategy
11. `freezy-9lt` - Integrate Moltbook API

### Phase 5: Submission
12. `freezy-1u8` - Create demo video and documentation

## Quick Commands

```bash
# See what's ready to work on
bd ready

# Start working on a task
bd update <id> --status=in_progress

# Mark task complete
bd close <id>

# See blocked tasks
bd blocked

# View specific task details
bd show <id>
```

## Ralph Loop Integration

For iterative development, use Ralph Loop:

```bash
/ralph-loop "Complete freezy-5zf: Initialize monorepo with pnpm and Turborepo. Create packages/ directory structure. Output <promise>MONOREPO READY</promise> when complete." --max-iterations 10 --completion-promise "MONOREPO READY"
```

## Resources

- [Moltiverse Hackathon](https://moltiverse.dev/)
- [Monad Docs](https://docs.monad.xyz/)
- [Nad.fun Docs](https://nad-fun.gitbook.io/nad.fun)
- [Nad.fun TypeScript SDK](https://github.com/naddotfun/nadfun-sdk-typescript)
- [AINad Framework](https://github.com/Techgethr/ainad)
- [Moltbook](https://moltbook.com)
