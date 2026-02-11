const fs = require('fs');
const path = require('path');

// Load .env file
const envFile = fs.readFileSync(path.join(__dirname, '.env'), 'utf8');
const dotenv = {};
for (const line of envFile.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    let val = match[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    dotenv[match[1].trim()] = val;
  }
}

module.exports = {
  apps: [
    {
      name: 'xnad-web',
      cwd: './apps/web',
      script: 'npm',
      args: 'run start -- -p 8030',
      env: {
        ...dotenv,
        NODE_ENV: 'production',
        PORT: 8030
      }
    },
    {
      name: 'xnad-backend',
      cwd: './apps/backend',
      script: 'dist/index.js',
      env: {
        ...dotenv,
        NODE_ENV: 'production',
        PORT: 8031
      }
    },
    {
      name: 'xnad-agent',
      cwd: './apps/agent',
      script: 'dist/index.js',
      env: {
        ...dotenv,
        NODE_ENV: 'production',
        PORT: 8032
      }
    },
    {
      name: 'xnad-indexer',
      cwd: './apps/indexer',
      script: './node_modules/.bin/ponder',
      args: 'start',
      exec_interpreter: 'bash',
      env: {
        ...dotenv,
        NODE_ENV: 'production',
        PORT: 8033
      }
    }
  ]
};
