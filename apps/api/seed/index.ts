import { loadEnvConfig } from '@next/env';
import { PrismaClient } from 'database';
import { seedUsers } from '../src/domains/user/user.seed';

loadEnvConfig(process.cwd());

const environment = process.env.ENVIRONMENT;
const prisma = new PrismaClient();

const main = async () => {
  if (!isTestingOrDevDatabase()) {
    console.error(`❌ Seeding is not allowed on ${environment} environment`);
    process.exit(1);
  }

  await seedUsers(prisma);

  console.log('✅ DB has been seeded');
};

const isTestingOrDevDatabase = () =>
  environment && ['dev', 'local'].includes(environment);

main();
