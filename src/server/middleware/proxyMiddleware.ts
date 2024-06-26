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

import { createProxyMiddleware as createHttpProxyMiddleware } from 'http-proxy-middleware';

import getConfigForServer from '../helpers/getConfigForServer';

const serverConfig = getConfigForServer();

/**
 * Below are the rules to proxying requests to api endpoints.
 * Normally, in development, all request to api endpoints are proxied to staging-2020.ensembl.org
 *
 * If you need to proxy only some requests to staging-2020 and others to a different host
 * (e.g. a review deployment or your local installation of an api endpoint),
 * update the current proxy middleware to exclude the endpoints you want to proxy to a different host,
 * and add a new dedicated middleware that would enable this proxying.
 *
 * EXAMPLE: to proxy all requests except for the genome browser backend to staging-2020,
 * while directing requests for the genome browser backend to your locally running server,
 * change the body of the createApiProxyMiddleware function as follows:

  const apiProxyMiddleware = createHttpProxyMiddleware({
    pathFilter: ['/api/**', '!/api/browser/**'],
    target: 'https://staging-2020.ensembl.org',
    changeOrigin: true,
    secure: false
  });

  const browserProxyMiddleware = createHttpProxyMiddleware({
    pathFilter: '/api/browser/**',
    target: 'http://localhost:3333',
    pathRewrite: {
      '^/api/browser': '/api' // rewrite path
    },
    changeOrigin: true,
    secure: false
  });

  return [apiProxyMiddleware, browserProxyMiddleware];
*/

const createApiProxyMiddleware = () => {
  const apiProxyMiddleware = createHttpProxyMiddleware({
    pathFilter: '/api',
    target: 'https://staging-2020.ensembl.org',
    changeOrigin: true,
    secure: false
  });

  // returning an array so that the specific proxies can be easily modified in local development
  // (see example in the comment block above)
  return [apiProxyMiddleware];
};

const createStaticAssetsMiddleware = () => {
  // proxy all requests for static assets to the server that runs webpack dev middleware
  return createHttpProxyMiddleware({
    pathFilter: '/static',
    target: 'http://localhost:8081'
  });
};

const createProxyMiddleware = () => {
  let proxyMiddleware = createApiProxyMiddleware();

  if (!serverConfig.isProductionBuild) {
    const staticAssetsMiddleware = createStaticAssetsMiddleware();
    proxyMiddleware = proxyMiddleware.concat([staticAssetsMiddleware]);
  }

  return proxyMiddleware;
};

export default createProxyMiddleware;
