import { PrismaClient } from 'database';
import { seedUsers } from '../domains/user/user.seed';

const prisma = new PrismaClient();

const seed = async () => {
  console.log('Seeding started...');

  if (!isTestingOrDevDatabase()) {
    console.log('❌ DB is not a testing or dev database, aborting seed');
    return;
  }

  seedUsers(prisma);

  console.log('✅ DB has been seeded');
};

const isTestingOrDevDatabase = () => {
  return true; //TODO proper check
};

seed();
