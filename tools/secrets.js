/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs/promises');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const projectConfig = require('../infra/config/config.json');

let environment = process.argv[2] === 'local' ? 'development' : process.argv[2];
let isLocal = process.argv[2] === 'local';

if (!environment) {
  throw new Error(
    `Please provide an environment as an argument. Available environments: ${projectConfig.environments.join(', ')}
    Example: pnpm run config development`,
  );
}

const project = `${projectConfig.project}-${environment}`;

const client = new SecretManagerServiceClient();

const apps = [
  {
    name: 'api',
    secretName: 'api',
  },
  {
    name: 'web',
    secretName: 'web',
  },
  {
    name: 'web-e2e',
    secretName: 'e2e',
  },
  {
    name: 'admin',
    secretName: 'web',
  },
  {
    name: 'admin-e2e',
    secretName: 'e2e',
  },
  {
    name: 'examples',
    secretName: 'web',
  },
  {
    name: 'mobile',
    secretName: 'mobile',
  },
];

const packages = ['database'];

const json = [
  {
    name: 'firebase-config',
    package: 'base/auth-frontend-base',
  },
  {
    name: 'gcp-service-account',
    app: 'api',
  },
  {
    name: 'gcp-service-account',
    package: 'base/auth-backend-base',
  },
  {
    name: 'google-services',
    app: 'mobile',
  },
];

const plist = [
  {
    name: 'GoogleService-Info',
    app: 'mobile',
  },
];

const availableEnvironments = [...projectConfig.environments, 'local'];

async function fetchSecret(secretName) {
  const name = `projects/${project}/secrets/${secretName}/versions/latest`;

  try {
    const [version] = await client.accessSecretVersion({
      name,
    });
    const payload = version.payload.data.toString();
    if (!payload) {
      throw new Error(`Could not fetch ${secretName}`);
    }

    return payload;
  } catch (e) {
    if (e.code === 5) {
      console.log(`Secret ${secretName} not found for this project`);
    } else {
      console.log(`Couldn't fetch secret ${secretName}`);
      console.error(e);
    }
    return null;
  }
}

async function downloadEnvironmentVariables(folder, secretName, app) {
  const docName = ['web', 'admin', 'examples'].includes(app)
    ? '.env.local'
    : '.env';
  const filename = `./${folder}/${app}/${docName}`;
  const data = await fetchSecret(secretName);
  if (data) {
    await fs.writeFile(filename, data);
    console.log(`${secretName} successfully stored into ${filename}`);
  }
}

async function downloadJSONEnvironmentVariables(folder, secretName, app) {
  const filename = `./${folder}/${app}/${secretName}.json`;
  const data = await fetchSecret(secretName);
  if (data) {
    await fs.writeFile(filename, data);
    console.log(`${secretName} successfully stored into ${filename}`);
  }
}

async function downloadPlistEnvironmentVariables(folder, secretName, app) {
  const filename = `./${folder}/${app}/${secretName}.plist`;
  const data = await fetchSecret(secretName);
  if (data) {
    await fs.writeFile(filename, data);
    console.log(`${secretName} successfully stored into ${filename}`);
  }
}

async function updateEasJson() {
  const envFilePath = './apps/mobile/.env';
  const easJsonPath = './apps/mobile/eas.json';

  const envData = await fs.readFile(envFilePath, 'utf8');
  const envLines = envData.split('\n').filter((line) => line.trim() !== '');

  if (['development', 'staging', 'production'].includes(environment)) {
    console.log('Environment is valid:', environment);

    const easJson = JSON.parse(await fs.readFile(easJsonPath, 'utf8'));
    easJson.build[environment].env = {};

    envLines.forEach((line) => {
      const [key, value] = line
        .split('=')
        .map((part) => part.trim().replace(/^"(.*)"$/, '$1')); // Remove surrounding double quotes
      if (key && value) {
        easJson.build[environment].env[key] = value;
      }
    });

    await fs.writeFile(easJsonPath, JSON.stringify(easJson, null, 2));
    console.log(
      `Environment variables successfully stored into ${easJsonPath} for ${environment} environment.`,
    );
  } else {
    console.log('Environment is not valid:', environment);
  }
}

async function main() {
  const postfix = isLocal ? '-local' : '';

  if (environment && !availableEnvironments.includes(environment)) {
    throw new Error(
      `Provided ENVIRONMENT value "${environment}" is not in available stages: ${availableEnvironments.map((environment) => `"${environment}"`).join(', ')}`,
    );
  }

  await Promise.all(
    apps.map(({ name, secretName }) => {
      return downloadEnvironmentVariables(
        'apps',
        `${secretName}${postfix}`,
        name,
      );
    }),
  );

  await Promise.all(
    packages.map((package) =>
      downloadEnvironmentVariables('packages', `${package}${postfix}`, package),
    ),
  );

  await Promise.all(
    json.map((package) => {
      const folder = package?.app ? 'apps' : 'packages';
      downloadJSONEnvironmentVariables(
        folder,
        `${package.name}`,
        package?.app ?? package?.package,
      );
    }),
  );

  await Promise.all(
    plist.map((package) => {
      const folder = package?.app ? 'apps' : 'packages';
      downloadPlistEnvironmentVariables(
        folder,
        `${package.name}`,
        package?.app ?? package?.package,
      );
    }),
  );

  await updateEasJson();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
