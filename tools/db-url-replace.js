// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const envFiles = [path.resolve(__dirname, '..', './packages/database/.env')];

async function main() {
  await Promise.all(
    envFiles.map(async (file) => {
      const fileContent = fs.readFileSync(file, 'utf-8');

      if (!fileContent) {
        throw new Error('No .env file found');
      }

      // Replace the host with the proxy port if needed
      const PROXY_PORT = '5433';

      const replaced = fileContent.replace(
        /(^DATABASE_URL=.*@)(.*?)(\/.*?)(host=.*?)&?(.*)$/m,
        `$1127.0.0.1:${PROXY_PORT}$3`,
      );

      fs.writeFileSync(file, replaced);
    }),
  );
}

main();
