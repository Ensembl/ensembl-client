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
import { Request, Response } from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { matchPath } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import { HelmetProvider, FilledContext } from 'react-helmet-async';
import { ChunkExtractor } from '@loadable/server';

import routesConfig, { type RouteConfig } from 'src/routes/routesConfig';
import { getPaths } from 'webpackDir/paths';
import { getConfigForClient } from '../helpers/getConfigForClient';
import { CONFIG_FIELD_ON_WINDOW } from 'src/shared/constants/globals';

import { getServerSideReduxStore } from '../serverSideReduxStore';

import Root from 'src/root/Root';

const paths = getPaths();
const statsFile = path.resolve(paths.buildStaticPath, 'loadable-stats.json');

const configForClient = getConfigForClient();

const viewRouter = async (req: Request, res: Response) => {
  // maintainers of the loadable component say that ChunkExtractor is stateful
  // and needs to be initialized at every request
  const extractor = new ChunkExtractor({
    statsFile,
    entrypoints: ['client']
  });

  const reduxStore = getServerSideReduxStore();
  const helmetContext = {};

  const matchedPageConfig = routesConfig.find((route) =>
    matchPath(route.path, req.path)
  ) as RouteConfig;

  let status = 200;

  if (matchedPageConfig.serverFetch) {
    try {
      const fetchResult =
        (await matchedPageConfig.serverFetch({
          path: req.path,
          store: reduxStore
        })) ?? {};
      if ('status' in (fetchResult as { status?: number })) {
        status = (fetchResult as { status: number }).status;
      }
    } catch (error) {
      // TODO: this would be a good place to log out the error when we set up loggers
      status = 500;
    }
  }

  const ReactApp = (
    <Provider store={reduxStore}>
      <StaticRouter location={req.url}>
        <HelmetProvider context={helmetContext}>
          <Root />
        </HelmetProvider>
      </StaticRouter>
    </Provider>
  );

  const jsx = extractor.collectChunks(ReactApp);

  const markup = renderToString(jsx);

  // Extract data after the React context has been populated during rendering
  const { helmet } = helmetContext as FilledContext;
  const reduxState = reduxStore.getState();

  const responseString = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <base href="/">
      ${helmet.title.toString()}
      ${helmet.meta.toString()}

      ${extractor.getLinkTags()}
      ${extractor.getStyleTags()}
      <script>
        window.__PRELOADED_STATE__ = ${JSON.stringify(reduxState)}
        window.${CONFIG_FIELD_ON_WINDOW} = ${JSON.stringify(configForClient)}
      </script>
      <script nomodule>
        window.location.replace("/unsupported-browser");
      </script>
      ${hotjarTrackingScript}
    </head>
    <body>  
      <div id="ens-app" class="ens-app">${markup}</div>
    
      ${extractor.getScriptTags()}
    </body>
    </html>
  `;

  if (matchedPageConfig.path === '*') {
    // TODO: Eventually, we will also need to return a 404 status code
    // if the data loader explicitly tells us so
    // (e.g. when the route is correct but a gene doesn't exist)
    res.status(404);
  }

  res.status(status).send(responseString);
};

// TODO: remove as soon as it is no longer needed
const hotjarId = 2555715; // if we discover that this needs to be updated, we will extract it into an environment variable
const hotjarTrackingScript = configForClient.environment.shouldReportAnalytics
  ? `
<script>
  (function (h, o, t, j, a, r) {
    h.hj =
      h.hj ||
      function () {
        (h.hj.q = h.hj.q || []).push(arguments);
      };
    h._hjSettings = { hjid: ${hotjarId}, hjsv: 6 };
    a = o.getElementsByTagName('head')[0];
    r = o.createElement('script');
    r.async = 1;
    r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
    a.appendChild(r);
  })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=');
</script>`
  : '';

export default viewRouter;
