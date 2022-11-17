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

import { Request, Response } from 'express';
import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { matchPath } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { Provider } from 'react-redux';
import pick from 'lodash/pick';

import routesConfig, { type RouteConfig } from 'src/routes/routesConfig';
import { getConfigForClient } from '../helpers/getConfigForClient';
import readWebpackAssetsManifest from '../helpers/readWebpackManifest';

import { getServerSideReduxStore } from '../serverSideReduxStore';

import Html from 'src/content/html/Html';
import Root from 'src/root/Root';

import type JSONValue from 'src/shared/types/JSON';

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
  }

  const ReactApp = (
    <Provider store={reduxStore}>
      <StaticRouter location={req.url}>
        <Html
          assets={getTransferableAssetsManifest(assetsManifest)}
          serverSideReduxState={reduxStore.getState() as unknown as JSONValue}
          serverSideConfig={configForClient}
        >
          <Root />
        </Html>
      </StaticRouter>
    </Provider>
  );

  const stream = renderToPipeableStream(ReactApp, {
    bootstrapScripts: getBootstrapScripts(assetsManifest),
    onShellReady() {
      // If something errored before we started streaming, we set the error code appropriately.
      res.statusCode = didError ? 500 : statusCode;
      res.statusCode = statusCode;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
    onError(x) {
      didError = true;
      console.error(x); // TODO: use a proper logger here
    }
  });

  // Abandon and switch to client rendering if enough time passes.
  // Try lowering this to see the client recover.
  // setTimeout(() => stream.abort(), ABORT_DELAY);
};

const getBootstrapScripts = (assetsManifest: Record<string, string>) => {
  // In development environment, the only entry point is the client.js file
  // In production, webpack will code-split and extract vendors.js and runtime-client.js chunks
  return [
    assetsManifest['client.js'],
    assetsManifest['vendors.js'],
    assetsManifest['runtime~client.js']
  ].filter(Boolean);
};

// pick only relevant fields from the assets manifest to pass to the client
const getTransferableAssetsManifest = (
  assetsManifest: Record<string, string>
) => {
  return pick(assetsManifest, ['client.css']);
};

export default viewRouter;
