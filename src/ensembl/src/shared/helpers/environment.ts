import config from 'config';

export enum Environment {
  DEVELOPMENT = 'development',
  INTERNAL = 'internal',
  PRODUCTION = 'production'
}

export const getEnvironmentAvailability = (
  environment: Environment | Environment[]
): boolean => {
  if (environment.indexOf(config.environment as Environment) !== -1) {
    return true;
  }

  return false;
};
