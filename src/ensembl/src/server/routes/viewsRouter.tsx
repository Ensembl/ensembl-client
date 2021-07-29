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
import { StaticRouter, matchPath } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider, FilledContext } from 'react-helmet-async';
import { ChunkExtractor } from '@loadable/server';

import routesConfig from 'src/routes/routesConfig';
import { getPaths } from 'ensemblRoot/webpack/paths';
import { getConfigForClient } from '../helpers/getConfigForClient';
import { CONFIG_FIELD_ON_WINDOW } from 'src/shared/constants/globals';

import { getServerSideReduxStore } from '../serverSideReduxStore';

import Root from 'src/root/Root';

const paths = getPaths();
const statsFile = path.resolve(paths.buildStaticPath, 'loadable-stats.json');

const viewRouter = async (req: Request, res: Response) => {
  // maintainers of the loadable component say that ChunkExtractor is stateful
  // and needs to be initialized at every request
  const extractor = new ChunkExtractor({
    statsFile,
    entrypoints: ['client']
  });

  const reduxStore = getServerSideReduxStore();
  const helmetContext = {};
  const routerContext = {};

  // load data server-side
  const dataRequirements = routesConfig
    .filter((route) => matchPath(req.path, route)) // filter matching paths
    .filter((route) => route.serverFetch) // check if components have data requirement
    .map((route) => {
      // FIXME: note that matchPath can't deal with query parameters and requires only a pathname (req.path),
      // so we should independently pass either the whole req object or just req.query to the serverFetch function
      const match = matchPath(req.path, route);
      return route.serverFetch?.({ match, store: reduxStore });
    });

  await Promise.all(dataRequirements);

  const ReactApp = (
    <Provider store={reduxStore}>
      <StaticRouter location={req.url} context={routerContext}>
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

  if ('url' in routerContext) {
    // a `url` field in filled router context indicates that somewhere a `<Redirect>` was rendered
    const url = (routerContext as any).url as string;
    res.redirect(301, url);
    return;
  }

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
        window.${CONFIG_FIELD_ON_WINDOW} = ${JSON.stringify(
    getConfigForClient()
  )}
      </script>
    </head>
    <body>  
      <div id="ens-app" class="ens-app">${markup}</div>
    
      ${extractor.getScriptTags()}
    </body>
    </html>
  `;

  if ('status' in routerContext) {
    const status = (routerContext as any).status as number;
    res.status(status);
  }

  res.send(responseString);
};

export default viewRouter;
