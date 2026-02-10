/**
 * Logger - Clean, colored, on-point logging for the trading agent
 */

// ANSI color codes
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',

  // Colors
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',

  // Backgrounds
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
};

function timestamp(): string {
  return `${c.gray}${new Date().toLocaleTimeString('en-US', { hour12: false })}${c.reset}`;
}

function truncAddr(addr: string): string {
  if (!addr || addr.length < 12) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export const log = {
  // --- Basic levels ---

  info(msg: string) {
    console.log(`${timestamp()} ${c.blue}INFO${c.reset}  ${msg}`);
  },

  success(msg: string) {
    console.log(`${timestamp()} ${c.green}${c.bold}OK${c.reset}    ${c.green}${msg}${c.reset}`);
  },

  warn(msg: string) {
    console.log(`${timestamp()} ${c.yellow}WARN${c.reset}  ${c.yellow}${msg}${c.reset}`);
  },

  error(msg: string, err?: unknown) {
    console.log(`${timestamp()} ${c.red}${c.bold}ERR${c.reset}   ${c.red}${msg}${c.reset}`);
    if (err) {
      const detail = err instanceof Error ? err.message : String(err);
      console.log(`${timestamp()}       ${c.dim}${detail}${c.reset}`);
    }
  },

  debug(msg: string) {
    if (process.env.DEBUG) {
      console.log(`${timestamp()} ${c.gray}DBG   ${msg}${c.reset}`);
    }
  },

  // --- Structured logging ---

  /** Log key-value pair inline */
  kv(key: string, value: string | number | boolean) {
    console.log(`${timestamp()}       ${c.gray}${key}:${c.reset} ${value}`);
  },

  /** Log a trade execution */
  trade(action: 'BUY' | 'SELL', symbol: string, amount: string, extra?: string) {
    const color = action === 'BUY' ? c.green : c.red;
    const icon = action === 'BUY' ? '\u25B2' : '\u25BC';
    console.log(
      `${timestamp()} ${color}${c.bold}${icon} ${action}${c.reset}  ${c.bold}${symbol}${c.reset} ${c.cyan}${amount} MON${c.reset}${extra ? ` ${c.gray}${extra}${c.reset}` : ''}`
    );
  },

  /** Log a trade result */
  tradeResult(success: boolean, detail: string) {
    if (success) {
      console.log(`${timestamp()}       ${c.green}\u2713 ${detail}${c.reset}`);
    } else {
      console.log(`${timestamp()}       ${c.red}\u2717 ${detail}${c.reset}`);
    }
  },

  /** Log vault info compactly */
  vault(addr: string, info: Record<string, string | number | boolean>) {
    console.log(`${timestamp()} ${c.magenta}VAULT${c.reset} ${c.bold}${truncAddr(addr)}${c.reset}`);
    for (const [k, v] of Object.entries(info)) {
      console.log(`${timestamp()}       ${c.gray}${k}:${c.reset} ${v}`);
    }
  },

  // --- Sections ---

  /** Section header */
  section(title: string) {
    console.log(`\n${timestamp()} ${c.cyan}${c.bold}\u2500\u2500\u2500 ${title} ${'─'.repeat(Math.max(0, 40 - title.length))}${c.reset}`);
  },

  /** Divider line */
  divider() {
    console.log(`${c.gray}${'─'.repeat(56)}${c.reset}`);
  },

  // --- Special ---

  /** Agent startup banner */
  banner(config: Record<string, string>) {
    console.log('');
    console.log(`${c.cyan}${c.bold}  ╔══════════════════════════════════════╗${c.reset}`);
    console.log(`${c.cyan}${c.bold}  ║     XNad Trading Agent               ║${c.reset}`);
    console.log(`${c.cyan}${c.bold}  ║     Social + Auto Trading on nad.fun ║${c.reset}`);
    console.log(`${c.cyan}${c.bold}  ╚══════════════════════════════════════╝${c.reset}`);
    console.log('');
    for (const [k, v] of Object.entries(config)) {
      console.log(`  ${c.gray}${k.padEnd(16)}${c.reset}${v}`);
    }
    console.log('');
  },

  /** Agent loop status summary */
  status(stats: Record<string, string | number>) {
    const sep = `  ${c.dim}|${c.reset}  `;
    const parts = Object.entries(stats)
      .map(([k, v]) => `${c.gray}${k}:${c.reset} ${c.bold}${v}${c.reset}`)
      .join(sep);
    console.log(`${timestamp()} ${c.blue}STATUS${c.reset} ${parts}`);
  },

  /** Skip/ignore message (dimmed) */
  skip(msg: string) {
    console.log(`${timestamp()} ${c.gray}SKIP  ${msg}${c.reset}`);
  },

  /** Dry run indicator */
  dry(msg: string) {
    console.log(`${timestamp()} ${c.yellow}${c.bold}DRY${c.reset}   ${c.yellow}${msg}${c.reset}`);
  },

  /** Helper to truncate addresses */
  addr: truncAddr,
};
