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

import { shouldReportAnalytics } from './getConfigForClient';

// To distinguish between Ensembl deployments (production, staging, internal, development),
// we use an environment variable called "ENVIRONMENT". When this variable is not set,
// we can assume that the code is running in local development mode, where the locally running server
// will need to proxy api requests and requests for static assets to relevant backends.
const isEnsemblDeployment = 'ENVIRONMENT' in process.env;

const isProductionBuild = process.env.NODE_ENV === 'production';

const getConfigForServer = () => ({
  isEnsemblDeployment,
  isProductionBuild,
  shouldReportAnalytics: shouldReportAnalytics()
});

export default getConfigForServer;
