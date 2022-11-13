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
import { Request, Response } from 'express';
import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { matchPath } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';

import routesConfig, { type RouteConfig } from 'src/routes/routesConfig';
import { getPaths } from 'webpackDir/paths';
import { getConfigForClient } from '../helpers/getConfigForClient';

import { getServerSideReduxStore } from '../serverSideReduxStore';

import Html from 'src/content/html/Html';
import Root from 'src/root/Root';

import type JSONValue from 'src/shared/types/JSON';

const paths = getPaths();

const configForClient = getConfigForClient();

const viewRouter = async (req: Request, res: Response) => {
  const assetsManifest = await readManifest();

  const reduxStore = getServerSideReduxStore();

  const matchedPageConfig = routesConfig.find((route) =>
    matchPath(route.path, req.path)
  ) as RouteConfig;

  let statusCode = 200;

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
  }

  const ReactApp = (
    <Provider store={reduxStore}>
      <StaticRouter location={req.url}>
        <Html
          assets={assetsManifest}
          serverSideReduxState={reduxStore.getState() as unknown as JSONValue}
          serverSideConfig={configForClient}
        >
          <Root />
        </Html>
      </StaticRouter>
    </Provider>
  );

  const stream = renderToPipeableStream(ReactApp, {
    bootstrapScripts: [
      assetsManifest['client.js'],
      assetsManifest['vendors.js'],
      assetsManifest['runtime~client.js']
    ].filter(Boolean), // FIXME: separate into a function?
    onShellReady() {
      // If something errored before we started streaming, we set the error code appropriately.
      // res.statusCode = didError ? 500 : 200;
      res.statusCode = statusCode;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
    onError(x) {
      console.error(x); // FIXME: should use proper logger here
    }
  });

  // Abandon and switch to client rendering if enough time passes.
  // Try lowering this to see the client recover.
  // setTimeout(() => stream.abort(), ABORT_DELAY);
};

export default viewRouter;

// FIXME: this should be memoized in production
const readManifest = async () => {
  const assetsManifestPath = path.resolve(
    paths.buildStaticPath,
    'manifest.json'
  );
  const manifestString = await readFile(assetsManifestPath, {
    encoding: 'utf-8'
  });
  return JSON.parse(manifestString);
};
