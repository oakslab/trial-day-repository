import { topLevelRole } from 'common';
import { Prisma, PrismaClient, UserRole, UserStatus } from 'database';
import firebase from 'firebase-admin';

export const userData: Prisma.UserCreateInput[] = [
  {
    uid: 'david.futera@oakslab.com',
    email: 'david.futera@oakslab.com',
    firstName: 'David',
    lastName: 'Futera',
    role: topLevelRole,
  },
  {
    uid: 'emmanuel@oakslab.com',
    email: 'emmanuel@oakslab.com',
    firstName: 'Emmanuel',
    lastName: 'Ihemegbulam',
    role: topLevelRole,
  },
  {
    uid: 'juraj@oakslab.com',
    email: 'juraj@oakslab.com',
    firstName: 'Juraj',
    lastName: 'Carnogursky',
    role: topLevelRole,
  },
  {
    uid: 'kadir@oakslab.com',
    email: 'kadir@oakslab.com',
    firstName: 'Kadir',
    lastName: 'Tereci',
    role: topLevelRole,
  },
  {
    uid: 'petr.m@oakslab.com',
    email: 'petr.m@oakslab.com',
    firstName: 'Petr',
    lastName: 'Máčal',
    role: topLevelRole,
  },
  {
    uid: 'petr@oakslab.com',
    email: 'petr@oakslab.com',
    firstName: 'Petr',
    lastName: 'Schefzu',
    role: topLevelRole,
  },
  {
    uid: 'tonda@oakslab.com',
    email: 'tonda@oakslab.com',
    firstName: 'Tonda',
    lastName: 'Kmoch',
    role: topLevelRole,
  },
  {
    uid: 'ugur.oruc@oakslab.com',
    email: 'ugur.oruc@oakslab.com',
    firstName: 'Uğur',
    lastName: 'Oruc',
    role: topLevelRole,
  },
  {
    uid: 'brett@oakslab.com',
    email: 'brett@oakslab.com',
    firstName: 'Brett',
    lastName: 'Gregson',
    role: topLevelRole,
  },
  {
    uid: 'dmitry@oakslab.com',
    email: 'dmitry@oakslab.com',
    firstName: 'Dmitry',
    lastName: 'Barabash',
    role: topLevelRole,
  },
  {
    uid: 'jakub@oakslab.com',
    email: 'jakub@oakslab.com',
    firstName: 'Jakub',
    lastName: 'Šlambora',
    role: topLevelRole,
  },
  {
    uid: 'marek.sokol@oakslab.com',
    email: 'marek.sokol@oakslab.com',
    firstName: 'Marek',
    lastName: 'Sokol',
    role: topLevelRole,
  },
  {
    uid: 'vladimir.rehor@oakslab.com',
    email: 'vladimir.rehor@oakslab.com',
    firstName: 'Vladimír',
    lastName: 'Řehoř',
    role: UserRole.ADMIN,
    status: UserStatus.ACTIVE,
  },
  {
    uid: 'vladimir.rehor+user@oakslab.com',
    email: 'vladimir.rehor+user@oakslab.com',
    firstName: 'Vladimír',
    lastName: 'Řehoř',
    role: UserRole.USER,
    status: UserStatus.ACTIVE,
  },
];

export const seedUsers = async (prisma: PrismaClient) => {
  firebase.initializeApp();

  // result with list of seeded users can be used in other seeds as inputs
  return Promise.all(
    [...userData].map((user) => seedTestUserAccount(prisma, user)),
  ).then((users) => {
    console.log('✅ Seeded users to DB & Firebase');
    return users;
  });
};

export const seedTestUserAccount = async (
  prisma: PrismaClient,
  user: (typeof userData)[number],
) => {
  await createFirebaseUser(user);

  return prisma.user.upsert({
    where: {
      email: user.email,
    },
    update: user,
    create: user,
  });
};

export const upsertDbUser = async (
  prisma: PrismaClient,
  user: (typeof userData)[number],
) => {
  return prisma.user.upsert({
    where: {
      uid: user.uid!,
    },
    update: user,
    create: user,
  });
};

export const createFirebaseUser = async (user: Prisma.UserCreateInput) => {
  return firebase
    .auth()
    .createUser({
      uid: user.uid!,
      email: user.email,
      password: user.email,
      emailVerified: user.status === UserStatus.ACTIVE,
    })
    .catch(async (err) => {
      if (
        !['auth/uid-already-exists', 'auth/email-already-exists'].includes(
          err.code,
        )
      )
        throw err;
    });
};
