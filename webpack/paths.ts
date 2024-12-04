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

import path from 'path';
import fs from 'fs';

// as long as the process gets started from the project root (via an npm command), this should work
const projectRoot = fs.realpathSync(process.cwd());

export const getPaths = (env = 'development') => {
  const isDev = ['dev', 'development'].includes(env);

  const rootPath = projectRoot;
  const staticPath = path.resolve(rootPath, 'static');
  const buildPath = path.resolve(rootPath, 'dist');

  return {
    rootPath,
    projectRoot,
    buildPath,
    staticPath,
    serverEntryPath: path.resolve(rootPath, 'src/server/index.ts'),
    serverStaticFilesPath: path.resolve(rootPath, 'src/server/static-files'),
    nodeModulesPath: path.resolve(rootPath, 'node_modules'),
    buildServerDir: path.resolve(buildPath, 'server'),
    buildServerStaticFilesPath: path.resolve(
      buildPath,
      'server',
      'static-files'
    ),
    buildStaticPath: path.resolve(buildPath, 'static'),
    htmlFileName: isDev ? 'index.html' : '../index.html',
    htmlTemplatePath: path.resolve(staticPath, 'html/template.html'),
    envTemplatePath: path.resolve(rootPath, '.env.example')
  };
};

export default {
  getPaths
};
