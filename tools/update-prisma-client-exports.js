#!/usr/bin/env node

const fs = require('fs/promises');

const updatePrismaExports = async () => {
  try {
    console.log('Updating Prisma Client exports field in package.json');
    const filePath = 'node_modules/@prisma/client/package.json';
    const data = await fs.readFile(filePath, 'utf8');
    const json = JSON.parse(data);

    if (json.exports && json.exports['.']) {
      const requireField = json.exports['.'].require || {};
      const importField = json.exports['.'].import || {};

      requireField.default = './default.js';
      importField.default = './default.js';

      json.exports['.'].require = requireField;
      json.exports['.'].import = importField;

      await fs.writeFile(filePath, JSON.stringify(json, null, 2), 'utf8');
      console.log('Prisma Client exports field updated successfully');
    } else {
      throw new Error('Prisma Client exports field not found');
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

updatePrismaExports();
