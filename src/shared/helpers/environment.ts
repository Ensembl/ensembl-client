/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { CONFIG_FIELD_ON_WINDOW } from 'src/shared/constants/globals';

export enum Environment {
  DEVELOPMENT = 'development',
  INTERNAL = 'internal',
  PRODUCTION = 'production'
}

const defaultEnvironment = {
  buildEnvironment: 'production',
  deploymentEnvironment: 'development'
};

export const readEnvironment = (): typeof defaultEnvironment => {
  if (isClient()) {
    // just make sure never to call this in jsdom environment
    return (
      (window as any)[CONFIG_FIELD_ON_WINDOW]?.environment ?? defaultEnvironment
    );
  } else {
    return {
      buildEnvironment: globalThis.process?.env.NODE_ENV ?? 'production',
      deploymentEnvironment:
        globalThis.process?.env.ENVIRONMENT ?? 'development'
    };
  }
};

// Deployment environment
export const isEnvironment = (environment: Environment[]): boolean => {
  const currentEnvironment = getDeploymentEnvironment();
  return environment.includes(currentEnvironment);
};

const getDeploymentEnvironment = () =>
  readEnvironment().deploymentEnvironment as Environment;

export const isServer = (): boolean => {
  return typeof window === 'undefined';
};

export const isClient = (): boolean => {
  return typeof window === 'object';
};
