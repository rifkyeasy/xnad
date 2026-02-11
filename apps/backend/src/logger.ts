/**
 * XNAD Backend Logger
 * Clean, professional, colored terminal output
 */

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',

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

export const log = {
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

  req(method: string, path: string, status: number, ms: number) {
    const color = status < 400 ? c.green : status < 500 ? c.yellow : c.red;
    console.log(
      `${ts()} ${c.blue}${pad('REQ')}${c.reset} ` +
      `${c.bold}${method}${c.reset} ${path}  ${color}${status}${c.reset}  ${c.dim}${ms}ms${c.reset}`
    );
  },

  banner(port: number) {
    console.log('');
    console.log(`  ${c.green}${c.bold}┌──────────────────────────────────────────┐${c.reset}`);
    console.log(`  ${c.green}${c.bold}│${c.reset}  ${c.cyan}${c.bold}XNAD${c.reset} ${c.dim}Backend API Server              ${c.reset}${c.green}${c.bold}│${c.reset}`);
    console.log(`  ${c.green}${c.bold}│${c.reset}  ${c.dim}Social AI Trading Agent on nad.fun   ${c.reset}${c.green}${c.bold}│${c.reset}`);
    console.log(`  ${c.green}${c.bold}└──────────────────────────────────────────┘${c.reset}`);
    console.log('');
    console.log(`  ${c.gray}port${c.reset}     ${c.bold}${port}${c.reset}`);
    console.log(`  ${c.gray}health${c.reset}   ${c.dim}http://localhost:${port}/health${c.reset}`);
    console.log('');
  },
};
