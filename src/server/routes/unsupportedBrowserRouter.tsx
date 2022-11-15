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

import { getConfigForClient } from '../helpers/getConfigForClient';
import readWebpackAssetsManifest from '../helpers/readWebpackManifest';

import UnsupportedBrowserHtml from 'src/content/unsupported-browser/UnsupportedBrowserHtml';
import UnsupportedBrowser from 'src/content/unsupported-browser/UnsupportedBrowser';

const configForClient = getConfigForClient();

const unsupportedBrowserRouter = async (_: Request, res: Response) => {
  const assetsManifest = await readWebpackAssetsManifest();

  const ReactApp = (
    <UnsupportedBrowserHtml
      assets={assetsManifest}
      serverSideConfig={configForClient}
    >
      <UnsupportedBrowser />
    </UnsupportedBrowserHtml>
  );

  const stream = renderToPipeableStream(ReactApp, {
    bootstrapScripts: getBootstrapScripts(assetsManifest),
    onShellReady() {
      res.statusCode = 200;
      res.setHeader('Content-type', 'text/html');
      stream.pipe(res);
    },
    onError(x) {
      console.error(x); // FIXME: should use proper logger here
    }
  });
};

const getBootstrapScripts = (assetsManifest: Record<string, string>) => {
  return configForClient.environment.buildEnvironment === 'production'
    ? [] // no need for javascript in the production build
    : [assetsManifest['unsupportedBrowser.js']];
};

export default unsupportedBrowserRouter;
