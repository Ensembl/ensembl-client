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

import { merge as webpackMerge } from 'webpack-merge';
import { Configuration } from 'webpack';

const getClientConfigPaths = (env: { dev: boolean }) => {
  const envConfigName = env.dev ? 'development' : 'production';
  return ['./client/common', `./client/${envConfigName}`];
};

const getServerConfigPaths = (env: { dev: boolean }) => {
  const envConfigName = env.dev ? 'development' : 'production';
  return ['./server/common', `./server/${envConfigName}`];
};

type GetConfigForEnvironmentParams = {
  dev: boolean;
  environment: 'client' | 'server';
};
const getConfigForEnvironment = async (
  params: GetConfigForEnvironmentParams
) => {
  const { environment } = params;
  let filePaths: string[];
  if (environment === 'client') {
    filePaths = getClientConfigPaths(params);
  } else {
    filePaths = getServerConfigPaths(params);
  }

  const partialConfigs = (await Promise.all(
    filePaths.map((filePath) =>
      import(filePath).then((factory) => factory.default(params))
    )
  )) as Configuration[];

  return webpackMerge(partialConfigs);
};

const getWebpackConfigs = async (env = { dev: true }) => {
  return await Promise.all([
    getConfigForEnvironment({ ...env, environment: 'client' }),
    getConfigForEnvironment({ ...env, environment: 'server' })
  ]);
};

export default getWebpackConfigs;
