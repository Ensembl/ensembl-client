import { getEnvironmentAvailability, Environment } from './environment';
import config from 'config';

describe('getEnvironmentAvailability', () => {
  // Set the environment to development
  config.environment = 'development';

  it('returns true if the envrionment matches', () => {
    const isAvailableOnEnvironment = getEnvironmentAvailability(
      Environment.DEVELOPMENT
    );

    expect(isAvailableOnEnvironment).toBe(true);
  });

  it('returns false if the envrionment does not match', () => {
    const isAvailableOnEnvironment = getEnvironmentAvailability(
      Environment.PRODUCTION
    );

    expect(isAvailableOnEnvironment).toBe(false);
  });

  it('accetps array of environments as input and returns true if at least one matches', () => {
    const isAvailableOnEnvironment = getEnvironmentAvailability([
      Environment.DEVELOPMENT,
      Environment.INTERNAL
    ]);

    expect(isAvailableOnEnvironment).toBe(true);
  });
});
