#!/usr/bin/env node

/*

I was getting the following error for both nextjs apps:

api:dev: npm ERR! code ENOWORKSPACES
api:dev: npm ERR! This command does not support workspaces.

web:dev: npm ERR! code ENOWORKSPACES
web:dev: npm ERR! This command does not support workspaces.

This error appears when invoking "dev" command due to an issue in the getRegistry
function within Next.js telemetry procedures. This function mistakenly identifies the package manager as Yarn if it's installed on the system, even when using npm for the project. This leads to npm config get registry being executed in a Yarn
workspace context, causing the error.

The fix simply disables nextjs telemetry using the hoisted nest binary (cli)
*/

const { exec } = require('node:child_process');
const { existsSync } = require('node:fs');
const { resolve } = require('node:path');

const nodeModulesPath = resolve(__dirname, '../node_modules');

if (!existsSync(nodeModulesPath)) {
  throw new Error(
    'node_modules not found. Did you install the workspace packages?',
  );
}

exec(
  [resolve(nodeModulesPath, '.bin/next'), 'telemetry', 'disable'].join(' '),
  (err, stdout, stderr) => {
    if (err || stderr) {
      console.error('Cannot disable nextjs telemetry');
      console.error(err || stderr);
      return;
    }

    console.log(stdout);
  },
);
