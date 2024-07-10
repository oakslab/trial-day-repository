const { spawn } = require('child_process');
const { resolve } = require('path');

const projectConfig = require('../infra/config/config.json');
const environment = process.argv[2];

if (!environment) {
  throw new Error(
    `Please provide an environment as an argument. Available environments: ${projectConfig.environments.join(', ')}
    Example: pnpm run --filter=database proxy development`,
  );
}

if (!projectConfig.environments.includes(environment)) {
  throw new Error(
    `Invalid environment. Available environments: ${projectConfig.environments.join(', ')}`,
  );
}

const project = `${projectConfig.project}-${environment}`;

const proxy = spawn(resolve(__dirname, './cloud_sql_proxy'), [
  `-instances=${project}:${projectConfig.region || 'us-central1'}:db-instance=tcp:5433`,
]);

proxy.stdout.pipe(process.stdout);
proxy.stderr.pipe(process.stderr);
