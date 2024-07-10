// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { execSync } = require('child_process');

const generatorName = 'api-crud';
const dummyName = 'dummyForTest';
const model_Dummy = `

model DummyForTest {
  id  String  @id @default(cuid())
}
`;

const prismaSchemaFile = path.resolve(
  __dirname,
  '..',
  './packages/database/prisma/schema.prisma',
);

const prismaDbmlFile = path.resolve(
  __dirname,
  '..',
  './packages/database/prisma/dbml/schema.dbml',
);

const commonDomainFile = path.resolve(
  __dirname,
  '..',
  `./packages/common/src/domain/index.ts`,
);

const appRouterFile = path.resolve(__dirname, '..', `./apps/api/src/app.ts`);

const apiDummyFolder = path.resolve(
  __dirname,
  '..',
  `apps/api/src/domains/${dummyName}/`,
);

const commonDummyFolder = path.resolve(
  __dirname,
  '..',
  `./packages/common/src/domain/${dummyName}/`,
);

async function main() {
  // Files which should be return back to initial state
  const prismaSchemaFileContent = fs.readFileSync(prismaSchemaFile, 'utf-8');
  const prismaDbmlFileContent = fs.readFileSync(prismaDbmlFile, 'utf-8');
  const commonDomainFileContent = fs.readFileSync(commonDomainFile, 'utf-8');
  const appRouterFileContent = fs.readFileSync(appRouterFile, 'utf-8');

  // Add new model Dummy to Prisma schema declaration file
  // Affects: "prismaSchemaFile"
  fs.writeFileSync(
    prismaSchemaFile,
    prismaSchemaFileContent.concat(model_Dummy),
  );

  // Generate Prisma client schemas with model_Dummy
  // Affects: "prismaDbmlFileContent"
  execSync(`pnpm run --filter=database generate`);

  // Run Turbo generators to produce code from template
  const foldersToCheck = [apiDummyFolder, commonDummyFolder, commonDomainFile];
  for (const dir of foldersToCheck) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Affects: "apiDummyFolder", "commonDummyFolder", "commonDomainFile"
  execSync(`pnpm exec turbo gen ${generatorName} --args '${dummyName}'`);

  try {
    // Run tests
    execSync(`pnpm run typecheck`, { stdio: 'inherit' });
    execSync(`pnpm run lint`, { stdio: 'inherit' });
  } finally {
    // Return affected files back to initial state
    fs.writeFileSync(prismaSchemaFile, prismaSchemaFileContent);
    fs.writeFileSync(prismaDbmlFile, prismaDbmlFileContent);
    fs.writeFileSync(commonDomainFile, commonDomainFileContent);
    fs.writeFileSync(appRouterFile, appRouterFileContent);
    fs.rmSync(apiDummyFolder, { recursive: true });
    fs.rmSync(commonDummyFolder, { recursive: true });
  }
}

main();
