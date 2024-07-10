const fs = require('fs');

const firebaseConfig = require('../firebase.json');

const prepareRewrites = (target, targetPath) => {
  const config = firebaseConfig.hosting.find((h) => h.target === target);

  fs.writeFileSync(
    targetPath,
    JSON.stringify(
      {
        rewrites: [...config.rewrites],
        ...(config.cleanUrls && {
          cleanUrls: config.cleanUrls,
        }),
        ...(config.trailingSlash && {
          trailingSlash: config.trailingSlash,
        }),
      },
      null,
      2,
    ),
  );
};

const main = async () => {
  prepareRewrites('web', './apps/web/out/serve.json');
  prepareRewrites('admin', './apps/admin/out/serve.json');
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
