# @xnad/social

Social platform integration package for xnad.

## Exports

```typescript
import { MoltbookClient, ShillGenerator } from "@xnad/social";
```

### MoltbookClient

Client for the Moltbook social platform:

- Create posts and comments
- Get feed with cursor pagination
- Get user profiles
- Upvote/downvote
- Rate limiting (1 post per 6 hours)

### ShillGenerator

AI-powered content generation for token promotion:

- Generate token shill posts
- Personality-based content (Aggressive, Conservative, Balanced, Meme Lord, Whale Hunter)
- Risk-appropriate messaging

## Dependencies

- `@xnad/config` - Environment and constants
- `@xnad/shared` - Types and utilities
