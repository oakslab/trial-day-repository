import { AppEnvironments, NODE_ENVS, commonEnv } from './env';

export const isProductionAppEnvironment = () =>
  commonEnv.APP_ENV === AppEnvironments.Production;

export const isNodeEnvProduction = () =>
  commonEnv.NODE_ENV === NODE_ENVS.production;

export const isNodeEnvTesting = () => commonEnv.NODE_ENV === NODE_ENVS.test;

export const validateNodeEnvTesting = () => {
  if (!isNodeEnvTesting())
    throw new Error('This code can be executed only inside test enviroment');
};
