// Source: https://github.com/ericvera/next-firebase-hosting-rewrites

/* eslint-disable @typescript-eslint/no-var-requires */
const findUp = require('find-up');
const glob = require('glob');
const fs = require('node:fs/promises');

// Helpers
const log = (message, ...optionalParams) => {
  if (optionalParams.length > 0) {
    console.log('> [FHR]', message, optionalParams);
  } else {
    console.log('> [FHR]', message || '');
  }
};

const logError = (message, ...optionalParams) => {
  if (optionalParams.length > 0) {
    console.error('> [FHR]', message, optionalParams);
  } else {
    console.error('> [FHR]', message || '');
  }
};

// Wrapper
const withFHR = (targets, firebaseConfigFileName) => (nextConfig) => {
  if (!targets || targets.length < 1) {
    throw new Error(
      `In order for this to work provide a list of targets to check for rewrites in the firebase.json hosting section.`,
    );
  }

  return Object.assign({}, nextConfig, {
    exportPathMap: async (defaultPathMap, { dir }) => {
      log('Validating Firebase Hosting Rules (FHR)...', dir);

      const firebaseConfigPath = await findUp(firebaseConfigFileName, {
        cwd: dir,
      });

      if (!firebaseConfigPath) {
        throw new Error(
          `${firebaseConfigFileName} not found looking through directories from ${dir} to the root.`,
        );
      }

      log(`Found Firebase config at ${firebaseConfigPath}.`);

      const firebaseConfig = JSON.parse(
        await fs.readFile(firebaseConfigPath, 'utf8'),
      );

      const firebaseConfigHosting = firebaseConfig.hosting;

      if (!firebaseConfigHosting) {
        throw new Error(
          `The config ${firebaseConfigPath} does not contain a "hosting" section. Add it and run this again.`,
        );
      }

      const firebaseConfigHostingItems = firebaseConfigHosting.filter(
        (hostingConfig) =>
          hostingConfig.target && targets.includes(hostingConfig.target),
      );

      if (firebaseConfigHostingItems.length === 0) {
        throw new Error(
          `The following targets were provided as parameter (${targets.join(
            ', ',
          )}), but no hosting entries with matching target were found.`,
        );
      }

      if (firebaseConfigHostingItems.length !== targets.length) {
        const foundTargets = firebaseConfigHostingItems.map(
          (item) => item.target,
        );

        throw new Error(
          `The following targets were provided as parameter (${targets.join(
            ', ',
          )}), but only (${foundTargets.join(', ')}).`,
        );
      }

      let errorFound = false;

      const allPages = glob.sync('pages/**/*.{ts,tsx,js,jsx}', {
        cwd: dir,
        ignore: ['pages/_*.ts', 'pages/_*.tsx'],
      });

      // Check if pages with dynamic routes are missing in firebase.json
      for (let page of [...allPages, ...Object.keys(defaultPathMap)]) {
        if (page.startsWith('pages/')) {
          page = page.slice('pages'.length);
        }

        if (page.includes('[')) {
          const targetPath = page.replace(/\.tsx?$/, '');
          const sourcePath = page.replace(/\[.*\]/g, '*');

          const rewriteRule = firebaseConfigHostingItems.reduce(
            (acc, hostingEntry) => {
              return (
                acc ||
                hostingEntry.rewrites?.find(
                  (val) => val.source === sourcePath,
                ) ||
                hostingEntry.rewrites?.find(
                  (val) => val.destination === `${targetPath}.html`,
                )
              );
            },
            null,
          );

          if (!rewriteRule) {
            errorFound = true;
            logError();
            logError('REWRITE RULE ERROR @ firebase.json/hosting');
            logError(`Missing rewrite rule for target path '${targetPath}'.`);
            logError('Include the following rewrite rule in firebase.json:');
            logError();
            logError(
              JSON.stringify(
                {
                  source: sourcePath,
                  destination: targetPath + '.html',
                },
                null,
                2,
              ),
            );
            logError();
          } else if (rewriteRule.destination !== targetPath + '.html') {
            errorFound = true;
            logError();
            logError('REWRITE RULE ERROR @ firebase.json/hosting');
            logError(`Incorrect rewrite rule for target path '${targetPath}'.`);
            logError('In firebase.json replace:');
            logError();
            logError(JSON.stringify(rewriteRule, null, 2));
            logError();
            logError('with');
            logError();
            logError(
              JSON.stringify(
                {
                  source: sourcePath,
                  destination: targetPath + '.html',
                },
                null,
                2,
              ),
            );
            logError();
          }
        }
      }

      if (errorFound) {
        throw new Error(
          `One or more rewrites rules missing or erroneous in '${firebaseConfigPath}'.`,
        );
      } else {
        log('[PASS] Firebase Hosting Rules are OK!');
      }

      return defaultPathMap;
    },
  });
};

module.exports = withFHR;
