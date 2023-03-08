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

import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { matchPath } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import type { Request, Response } from 'express';

import routesConfig, { type RouteConfig } from 'src/routes/routesConfig';
import { getConfigForClient } from '../helpers/getConfigForClient';
import readWebpackAssetsManifest from '../helpers/readWebpackManifest';
import renderTemplate from '../templates/page';

import { getServerSideReduxStore } from '../serverSideReduxStore';

import Root from 'src/root/Root';

const configForClient = getConfigForClient();

const viewRouter = async (req: Request, res: Response) => {
  const assetsManifest = await readWebpackAssetsManifest();

  const reduxStore = getServerSideReduxStore();

  const matchedPageConfig = routesConfig.find((route) =>
    matchPath(route.path, req.path)
  ) as RouteConfig;

  let statusCode = 200;
  let didError = false;

  if (matchedPageConfig.serverFetch) {
    try {
      const fetchResult =
        (await matchedPageConfig.serverFetch({
          path: req.path,
          store: reduxStore
        })) ?? {};
      if ('status' in (fetchResult as { status?: number })) {
        statusCode = (fetchResult as { status: number }).status;
      }
    } catch (error) {
      // TODO: this would be a good place to log out the error when we set up loggers
      statusCode = 500;
    }
  } else if (matchedPageConfig.path === '*') {
    statusCode = 404;
  }

  const ReactApp = (
    <Provider store={reduxStore}>
      <StaticRouter location={req.url}>
        <Root />
      </StaticRouter>
    </Provider>
  );

  const stream = renderToPipeableStream(ReactApp, {
    onShellReady() {
      // If something errored before we started streaming, we set the error code appropriately.
      res.statusCode = didError ? 500 : statusCode;
      res.statusCode = statusCode;
      res.setHeader('Content-type', 'text/html');

      const template = renderTemplate({
        assets: assetsManifest,
        state: reduxStore.getState(),
        config: configForClient
      });

      const [beforeReactApp, afterReactApp] = template.split(
        '<!-- Inject app -->'
      );

      res.write(beforeReactApp);
      stream.pipe(res);
      res.write(afterReactApp);
      res.end();
    },
    onError(x) {
      didError = true;
      console.error(x); // TODO: use a proper logger here
    }
  });
};

export default viewRouter;
