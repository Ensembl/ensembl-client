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
import { readFile } from 'fs/promises';
import memoize from 'lodash/memoize';

import { getPaths } from 'webpackDir/paths';
import { getConfigForClient } from 'src/server/helpers/getConfigForClient';

const paths = getPaths();

const readWebpackAssetsManifest = async () => {
  const assetsManifestPath = path.resolve(
    paths.buildStaticPath,
    'manifest.json'
  );
  const manifestString = await readFile(assetsManifestPath, {
    encoding: 'utf-8'
  });
  return JSON.parse(manifestString);
};

const isProductionBuild =
  getConfigForClient().environment.buildEnvironment === 'production';

export default isProductionBuild
  ? memoize(readWebpackAssetsManifest) // no need to read the manifest file at every render
  : readWebpackAssetsManifest;
