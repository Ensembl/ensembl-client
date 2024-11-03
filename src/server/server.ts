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

import express from 'express';

import createProxyMiddleware from './middleware/proxyMiddleware';
import staticMiddleware from './middleware/staticMiddleware';
import redirectMiddleware from './middleware/redirectMiddleware';

import getConfigForServer from './helpers/getConfigForServer';

import viewsRouter from './routes/viewsRouter';
import unsupportedBrowserRouter from './routes/unsupportedBrowserRouter';

const app = express();
const serverConfig = getConfigForServer();

app.disable('x-powered-by'); // no need to announce to the world that we are running on Express

if (!serverConfig.isEnsemblDeployment) {
  const proxyMiddleware = createProxyMiddleware();
  app.use(proxyMiddleware);

  if (serverConfig.isProductionBuild) {
    // The most likely scenario of this configuration is testing of the production build locally.
    // The development server won't be running; therefore we should handle requests for static assets here
    app.use('/static', staticMiddleware);
  }
}

app.use(redirectMiddleware);

app.get('/unsupported-browser', unsupportedBrowserRouter);
// All GET requests not covered by the middleware above will be handled by the viewsRouter
app.get('*splat', viewsRouter);

export default app;
