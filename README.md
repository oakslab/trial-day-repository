# Reusability Repository

## Getting Started

### Local prerequisites

- Local Node and NPM versions matching the ones specified in the package.json file.

  - For to have multiple node & npm versions, [volta](https://volta.sh/) is recommended.

- Enable corepack to use pnpm

  - If you have modern Node (>v18) Run `sudo corepack enable`
  - Check that pnpm installed `pnpm --version`
  - Update if necessary `corepack prepare pnpm@latest --activate`

- Google Cloud SDK

  - See [here](https://cloud.google.com/sdk/docs/install) for installation

- Docker

  - See [here](https://www.docker.com/) for installation

- PostgreSQL Database
  - Docker is required for this step!
  - Run `npm run local -w database` will download and run local postgreSQL database for you.

### Installation

1. To install dependencies, run `pnpm install` in the root directory.

   - To run some package script alternatively to `npm npx`
     - Just use `pnpm dlx`
   - To manage dependencies
     - `pnpm add <pkg>` to install package
     - `pnpm remove <pkg>` to remove package
     - `pnpm add -D <pkg>` to install package as dev dependency
     - `pnpm add -g <pkg>` to install package globally

2. Ask tech lead to provide missing configuration files (`gcp-service-account.json` & `firebase-config.json`) and copy them to following paths:

   - `./apps/api/gcp-service-account.json`
   - `./packages/base/auth-backend-base/gcp-service-account.json`
   - `./packages/base/auth-frontend-base/firebase-config.json`

3. Copy `./packages/database/.env.local` to `./packages/database/.env`

4. Make sure you have latest migrations on your database. Run `pnpm run --filter=database migrate:dev` in the root directory. This will run all the migrations to your local database.

5. Run `pnpm run build` in the root directory to check

6. Run `pnpm run dev` in the root directory to start the application.

   - This will run following ports on your local machine:
     - 3000: Frontend - Web
     - 3001: Backend
     - 3002: Firebase Authentication
     - 4000: Firebase Emulator
     - 5432: PostgreSQL Database (login: `prisma`, password: `password`, database: `reusable_repo`)

7. Seed the DB & Firebase: `pnpm run --filter=api seed`

   - In order to seed Firebase users on local, emulators must be running (part of previous step)
   - Firebase passwords are same as email by default. In case of existing Firebase user, passwords are NOT overwritten

8. Run the web app on [http://localhost:3000](http://localhost:3000) in browser and use `vladimir.rehor+user@oakslab.com` / `vladimir.rehor+user@oakslab.com` credentials to log in.

### Other Guides

Click on any of the links below to access other guides:

- [API Guide](/apps/api/README.md)
- [Web Guide](/apps/web/README.md)
- [Admin Guide](/apps/admin/README.md)
- [Tools Guide](/tools/README.md)
- [Infrastructure Guide](infra/README.md)

### Tracing setup

#### Domain Code Generator Guide (For API)

**How to Use:**

Run the generator with the following command:

```
pnpm run gen
```

"[API][Domain] CRUD Generator" option will automatically generate the following files

_Files Generated:_

• /apps/api/src/domains/{{kebabCase domain}}/{{kebabCase domain}}-create.endpoint.ts (add)
• /apps/api/src/domains/{{kebabCase domain}}/{{kebabCase domain}}-delete.endpoint.ts (add)
• /apps/api/src/domains/{{kebabCase domain}}/{{kebabCase domain}}-list.endpoint.ts (add)
• /apps/api/src/domains/{{kebabCase domain}}/{{kebabCase domain}}-update.endpoint.ts (add)
• /apps/api/src/domains/{{kebabCase domain}}/{{kebabCase domain}}.repo.ts (add)
• /apps/api/src/domains/{{kebabCase domain}}/{{kebabCase domain}}.router.ts (add)
• /packages/common/src/domain/{{kebabCase domain}}/{{kebabCase domain}}-create.types.ts (add)
• /packages/common/src/domain/{{kebabCase domain}}/{{kebabCase domain}}-delete.types.ts (add)
• /packages/common/src/domain/{{kebabCase domain}}/{{kebabCase domain}}-list.types.ts (add)
• /packages/common/src/domain/{{kebabCase domain}}/{{kebabCase domain}}-update.types.ts (add)
• /packages/common/src/domain/{{kebabCase domain}}/{{kebabCase domain}}.types.ts (add)
• /packages/common/src/domain/{{kebabCase domain}}/index.ts (add)
• /packages/common/src/domain/index.ts (append)

## Testing

### Backend

### Testing endpoints

- For endpoint testing we use **integration tests**.
  - Unlike unit tests, integration tests run tRPC procedures in a way very similar to the real application, e.g. with actual backend services instead of mocks, they connect to real DB etc.
- See the [example spec](./apps/api/src/domains/user/user-list.endpoint.spec.ts) for guidance on how to:
  - Arrange integration tests including fixture data.
  - Run a tRPC procedure under test as a user in any role.
  - Assert the data returned from the procedure.
  - Test exceptions being thrown, e.g., on unauthorized procedure calls.
- Integration tests run on the **same local database** we use for development:
  - Tests **must not** rely on any existing data in the database (not even seeded data).
  - Each test is responsible for preparing its own test data using fixtures.
  - Assertions must account for the possibility that the database may contain data other than what was prepared with fixtures.
    - For example, data returned from a tRPC query call may also include entities that were not created for the test.
- Note also that all middlewares run when the tested tRPC procedure is called, ensuring they work as expected.

## Testing services

- For testing services, unit tests are beeter fit because it allows to easily isolated tested code by mocking all dependencies and simulate edge cases sometimes hardly reproducible in integration test setup.
- See the [example spec](./apps/api/src/lib/db/transactionService.ts) for guidance how to:
  - Create type-safe mocks for dependencies using [@golevelup/ts-jest](https://github.com/golevelup/nestjs/tree/master/packages/testing/ts-jest#creating-mocks)
  - Arrange the state of service under tests and it's dependencies
  - Call tested services
  - Assert the expected nehavior including edge cases
