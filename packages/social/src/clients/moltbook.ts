import { env, API_ENDPOINTS, MOLTBOOK_CONFIG } from '@cartel/config';
import { createLogger, retry, sleep } from '@cartel/shared';

const logger = createLogger('moltbook');

export interface MoltbookPost {
  id: string;
  title: string;
  content: string;
  submolt: string;
  authorId: string;
  authorName: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  createdAt: Date;
}

export interface MoltbookComment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  parentId?: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
}

export interface MoltbookAgent {
  id: string;
  name: string;
  followers: number;
  following: number;
  posts: number;
  karma: number;
  createdAt: Date;
}

export interface MoltbookFeed {
  posts: MoltbookPost[];
  hasMore: boolean;
  nextCursor?: string;
}

export interface MoltbookConfig {
  apiUrl?: string;
  apiKey?: string;
}

export class MoltbookClient {
  private apiUrl: string;
  private apiKey: string;
  private lastPostTime: Date | null = null;
  private lastCommentTime: Date | null = null;
  private commentsToday = 0;
  private lastCommentReset: Date = new Date();

  constructor(config: MoltbookConfig = {}) {
    this.apiUrl = config.apiUrl || API_ENDPOINTS.moltbook;
    this.apiKey = config.apiKey || env.MOLTBOOK_API_KEY || '';

    if (!this.apiKey) {
      logger.warn('No Moltbook API key provided - some features may be limited');
    }

    logger.info('Moltbook client initialized', { apiUrl: this.apiUrl });
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.apiUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await retry(
      async () => {
        const res = await fetch(url, { ...options, headers });
        if (!res.ok) {
          const error = await res.text();
          throw new Error(`Moltbook API error: ${res.status} - ${error}`);
        }
        return res.json() as Promise<T>;
      },
      {
        maxAttempts: 3,
        delayMs: 1000,
        onRetry: (error, attempt) => {
          logger.warn(`Retrying Moltbook request (attempt ${attempt})`, {
            error: error.message,
          });
        },
      }
    );

    return response;
  }

  /**
   * Check and enforce rate limits
   */
  private async enforceRateLimits(action: 'post' | 'comment'): Promise<void> {
    const now = new Date();

    // Reset daily comment counter
    if (now.getDate() !== this.lastCommentReset.getDate()) {
      this.commentsToday = 0;
      this.lastCommentReset = now;
    }

    if (action === 'post' && this.lastPostTime) {
      const timeSinceLastPost = now.getTime() - this.lastPostTime.getTime();
      const cooldown = MOLTBOOK_CONFIG.RATE_LIMITS.POST_COOLDOWN;

      if (timeSinceLastPost < cooldown) {
        const waitTime = cooldown - timeSinceLastPost;
        logger.debug(`Waiting ${waitTime}ms for post cooldown`);
        await sleep(waitTime);
      }
    }

    if (action === 'comment') {
      if (this.commentsToday >= MOLTBOOK_CONFIG.RATE_LIMITS.MAX_COMMENTS_PER_DAY) {
        throw new Error('Daily comment limit reached');
      }

      if (this.lastCommentTime) {
        const timeSinceLastComment = now.getTime() - this.lastCommentTime.getTime();
        const cooldown = MOLTBOOK_CONFIG.RATE_LIMITS.COMMENT_COOLDOWN;

        if (timeSinceLastComment < cooldown) {
          const waitTime = cooldown - timeSinceLastComment;
          logger.debug(`Waiting ${waitTime}ms for comment cooldown`);
          await sleep(waitTime);
        }
      }
    }
  }

  // ============ Feed ============

  /**
   * Get personalized feed
   */
  async getFeed(
    sort: 'hot' | 'new' | 'top' | 'rising' = 'hot',
    cursor?: string
  ): Promise<MoltbookFeed> {
    const params = new URLSearchParams({ sort });
    if (cursor) params.set('cursor', cursor);

    return this.request<MoltbookFeed>(`/feed?${params}`);
  }

  /**
   * Get global feed
   */
  async getGlobalFeed(
    sort: 'hot' | 'new' | 'top' | 'rising' = 'hot'
  ): Promise<MoltbookFeed> {
    return this.request<MoltbookFeed>(`/feed/global?sort=${sort}`);
  }

  /**
   * Get submolt feed
   */
  async getSubmoltFeed(
    submolt: string,
    sort: 'hot' | 'new' | 'top' | 'rising' = 'hot'
  ): Promise<MoltbookFeed> {
    return this.request<MoltbookFeed>(`/submolts/${submolt}/feed?sort=${sort}`);
  }

  // ============ Posts ============

  /**
   * Create a new post
   */
  async createPost(params: {
    submolt: string;
    title: string;
    content: string;
  }): Promise<MoltbookPost> {
    await this.enforceRateLimits('post');

    logger.info('Creating post', { submolt: params.submolt, title: params.title });

    const post = await this.request<MoltbookPost>('/posts', {
      method: 'POST',
      body: JSON.stringify(params),
    });

    this.lastPostTime = new Date();
    logger.info('Post created', { postId: post.id });

    return post;
  }

  /**
   * Get a post by ID
   */
  async getPost(postId: string): Promise<MoltbookPost> {
    return this.request<MoltbookPost>(`/posts/${postId}`);
  }

  /**
   * Vote on a post
   */
  async votePost(postId: string, direction: 1 | -1 | 0): Promise<void> {
    await this.request(`/posts/${postId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ direction }),
    });

    logger.debug('Voted on post', { postId, direction });
  }

  // ============ Comments ============

  /**
   * Get comments for a post
   */
  async getComments(postId: string): Promise<{ comments: MoltbookComment[] }> {
    return this.request(`/posts/${postId}/comments`);
  }

  /**
   * Create a comment
   */
  async createComment(params: {
    postId: string;
    content: string;
    parentId?: string;
  }): Promise<MoltbookComment> {
    await this.enforceRateLimits('comment');

    logger.info('Creating comment', { postId: params.postId });

    const comment = await this.request<MoltbookComment>(
      `/posts/${params.postId}/comments`,
      {
        method: 'POST',
        body: JSON.stringify({
          content: params.content,
          parent_id: params.parentId,
        }),
      }
    );

    this.lastCommentTime = new Date();
    this.commentsToday++;

    logger.info('Comment created', { commentId: comment.id });
    return comment;
  }

  /**
   * Vote on a comment
   */
  async voteComment(commentId: string, direction: 1 | -1 | 0): Promise<void> {
    await this.request(`/comments/${commentId}/vote`, {
      method: 'POST',
      body: JSON.stringify({ direction }),
    });

    logger.debug('Voted on comment', { commentId, direction });
  }

  // ============ Search ============

  /**
   * Search posts, agents, or submolts
   */
  async search(
    query: string,
    type: 'posts' | 'agents' | 'submolts' = 'posts'
  ): Promise<unknown> {
    return this.request(`/search?q=${encodeURIComponent(query)}&type=${type}`);
  }

  // ============ Agents ============

  /**
   * Get agent profile
   */
  async getAgent(agentId: string): Promise<MoltbookAgent> {
    return this.request<MoltbookAgent>(`/agents/${agentId}`);
  }

  /**
   * Follow an agent
   */
  async followAgent(agentId: string): Promise<void> {
    await this.request(`/agents/${agentId}/follow`, { method: 'POST' });
    logger.debug('Followed agent', { agentId });
  }

  /**
   * Unfollow an agent
   */
  async unfollowAgent(agentId: string): Promise<void> {
    await this.request(`/agents/${agentId}/follow`, { method: 'DELETE' });
    logger.debug('Unfollowed agent', { agentId });
  }

  // ============ Stats ============

  /**
   * Get remaining rate limit info
   */
  getRateLimitInfo() {
    const now = new Date();
    const postCooldownRemaining = this.lastPostTime
      ? Math.max(
          0,
          MOLTBOOK_CONFIG.RATE_LIMITS.POST_COOLDOWN -
            (now.getTime() - this.lastPostTime.getTime())
        )
      : 0;

    const commentCooldownRemaining = this.lastCommentTime
      ? Math.max(
          0,
          MOLTBOOK_CONFIG.RATE_LIMITS.COMMENT_COOLDOWN -
            (now.getTime() - this.lastCommentTime.getTime())
        )
      : 0;

    return {
      canPost: postCooldownRemaining === 0,
      postCooldownMs: postCooldownRemaining,
      canComment:
        commentCooldownRemaining === 0 &&
        this.commentsToday < MOLTBOOK_CONFIG.RATE_LIMITS.MAX_COMMENTS_PER_DAY,
      commentCooldownMs: commentCooldownRemaining,
      commentsRemaining:
        MOLTBOOK_CONFIG.RATE_LIMITS.MAX_COMMENTS_PER_DAY - this.commentsToday,
    };
  }
}

// Singleton
let _client: MoltbookClient | null = null;

export function getMoltbookClient(config?: MoltbookConfig): MoltbookClient {
  if (!_client) {
    _client = new MoltbookClient(config);
  }
  return _client;
}
