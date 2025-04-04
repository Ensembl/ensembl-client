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
import { Router } from 'express';

import { getPaths } from 'webpackDir/paths';

import getConfigForServer from 'src/server/helpers/getConfigForServer';

const router = Router();
const paths = getPaths();
const serverConfig = getConfigForServer();

router.get('/robots.txt', (_, res) => {
  // Abusing the REPORT_ANALYTICS environment variable slightly
  // to decide which robots file to respond with.
  // REPORT_ANALYTICS allows us to distinguish the real production deployment,
  // which it makes sense to index, from the staging deployment,
  // which otherwise is identical to production, but should not be indexed.
  const fileName = serverConfig.shouldReportAnalytics
    ? 'robots.txt'
    : 'restrictive-robots.txt';
  const pathToFile = path.resolve(paths.buildServerStaticFilesPath, fileName);
  res.sendFile(pathToFile);
});

// Verification of site ownership for Google search console
router.get('/googlee4740abdaad60317.html', (_, res) => {
  const pathToFile = path.resolve(
    paths.buildServerStaticFilesPath,
    'google-site-verification.txt'
  );
  res.sendFile(pathToFile, {
    headers: {
      'Content-Type': 'text/html'
    }
  });
});

export default router;
