/**
 * XNAD Agent Logger
 * Clean, professional, colored terminal output
 */

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',

  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',

  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

function ts(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${c.dim}${h}:${m}:${s}${c.reset}`;
}

function pad(label: string, len = 6): string {
  return label.padEnd(len);
}

function addr(a: string): string {
  if (!a || a.length < 12) return a;
  return `${a.slice(0, 6)}...${a.slice(-4)}`;
}

export const log = {
  // ── Basic levels ──────────────────────────────────────────

  info(msg: string) {
    console.log(`${ts()} ${c.cyan}${pad('INFO')}${c.reset} ${msg}`);
  },

  success(msg: string) {
    console.log(`${ts()} ${c.green}${c.bold}${pad('OK')}${c.reset} ${c.green}${msg}${c.reset}`);
  },

  warn(msg: string) {
    console.log(`${ts()} ${c.yellow}${c.bold}${pad('WARN')}${c.reset} ${c.yellow}${msg}${c.reset}`);
  },

  error(msg: string, err?: unknown) {
    console.log(`${ts()} ${c.red}${c.bold}${pad('ERROR')}${c.reset} ${c.red}${msg}${c.reset}`);
    if (err) {
      const detail = err instanceof Error ? err.message : String(err);
      console.log(`${ts()} ${pad('')} ${c.dim}${detail}${c.reset}`);
    }
  },

  fatal(msg: string, err?: unknown) {
    console.log(`${ts()} ${c.bgRed}${c.white}${c.bold} FATAL ${c.reset} ${c.red}${c.bold}${msg}${c.reset}`);
    if (err) {
      const detail = err instanceof Error ? err.stack || err.message : String(err);
      console.log(`${c.dim}${detail}${c.reset}`);
    }
  },

  debug(msg: string) {
    if (process.env.DEBUG) {
      console.log(`${ts()} ${c.gray}${pad('DEBUG')} ${msg}${c.reset}`);
    }
  },

  // ── Structured ────────────────────────────────────────────

  kv(key: string, value: string | number | boolean) {
    console.log(`${ts()} ${pad('')} ${c.gray}${key}${c.reset} ${c.bold}${value}${c.reset}`);
  },

  table(data: Record<string, string | number | boolean>) {
    const maxKey = Math.max(...Object.keys(data).map((k) => k.length));
    for (const [k, v] of Object.entries(data)) {
      console.log(`${ts()} ${pad('')} ${c.gray}${k.padEnd(maxKey)}${c.reset}  ${c.bold}${v}${c.reset}`);
    }
  },

  // ── Trading ───────────────────────────────────────────────

  trade(action: 'BUY' | 'SELL', symbol: string, amount: string, extra?: string) {
    const color = action === 'BUY' ? c.green : c.red;
    const icon = action === 'BUY' ? '\u25B2' : '\u25BC';
    console.log(
      `${ts()} ${color}${c.bold}${icon} ${pad(action)}${c.reset} ` +
      `${c.bold}${symbol}${c.reset} ${c.cyan}${amount} MON${c.reset}` +
      (extra ? `  ${c.dim}${extra}${c.reset}` : '')
    );
  },

  tradeResult(success: boolean, detail: string) {
    const icon = success ? `${c.green}\u2713` : `${c.red}\u2717`;
    console.log(`${ts()} ${pad('')} ${icon} ${detail}${c.reset}`);
  },

  // ── X / Twitter ───────────────────────────────────────────

  x(action: string, detail: string) {
    console.log(`${ts()} ${c.blue}${c.bold}${pad('@X')}${c.reset} ${action}  ${c.dim}${detail}${c.reset}`);
  },

  tweet(author: string, signal: string, confidence?: number) {
    const confStr = confidence != null ? `${c.yellow}${(confidence * 100).toFixed(0)}%${c.reset}` : '';
    console.log(`${ts()} ${pad('')} ${c.blue}@${author}${c.reset}  ${signal}  ${confStr}`);
  },

  // ── Vault ─────────────────────────────────────────────────

  vault(label: string, info: Record<string, string | number | boolean>) {
    console.log(`${ts()} ${c.magenta}${c.bold}${pad('VAULT')}${c.reset} ${label}`);
    for (const [k, v] of Object.entries(info)) {
      console.log(`${ts()} ${pad('')} ${c.gray}${k}${c.reset} ${v}`);
    }
  },

  // ── Sections ──────────────────────────────────────────────

  section(title: string) {
    const line = '\u2500'.repeat(Math.max(0, 44 - title.length));
    console.log(`\n${ts()} ${c.cyan}${c.bold}\u2500\u2500 ${title} ${line}${c.reset}`);
  },

  divider() {
    console.log(`${c.dim}${'─'.repeat(56)}${c.reset}`);
  },

  // ── Status ────────────────────────────────────────────────

  status(stats: Record<string, string | number>) {
    const parts = Object.entries(stats)
      .map(([k, v]) => `${c.gray}${k}${c.reset} ${c.bold}${v}${c.reset}`)
      .join(`  ${c.dim}\u2502${c.reset}  `);
    console.log(`${ts()} ${c.blue}${pad('STATUS')}${c.reset} ${parts}`);
  },

  skip(msg: string) {
    console.log(`${ts()} ${c.gray}${pad('SKIP')} ${msg}${c.reset}`);
  },

  dry(msg: string) {
    console.log(`${ts()} ${c.yellow}${c.bold}${pad('DRY')}${c.reset} ${c.yellow}${msg}${c.reset}`);
  },

  // ── Banner ────────────────────────────────────────────────

  banner(name: string, config: Record<string, string>) {
    console.log('');
    console.log(`  ${c.green}${c.bold}┌──────────────────────────────────────────┐${c.reset}`);
    console.log(`  ${c.green}${c.bold}│${c.reset}  ${c.cyan}${c.bold}XNAD${c.reset} ${c.dim}${name.padEnd(33)}${c.reset}${c.green}${c.bold}│${c.reset}`);
    console.log(`  ${c.green}${c.bold}│${c.reset}  ${c.dim}Social AI Trading Agent on nad.fun   ${c.reset}${c.green}${c.bold}│${c.reset}`);
    console.log(`  ${c.green}${c.bold}└──────────────────────────────────────────┘${c.reset}`);
    console.log('');
    const maxKey = Math.max(...Object.keys(config).map((k) => k.length));
    for (const [k, v] of Object.entries(config)) {
      console.log(`  ${c.gray}${k.padEnd(maxKey)}${c.reset}  ${v}`);
    }
    console.log('');
  },

  // ── Helpers ───────────────────────────────────────────────

  addr,
};
