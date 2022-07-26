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
import { ChunkExtractor } from '@loadable/server';

import { getPaths } from 'webpackDir/paths';

import UnsupportedBrowser from 'src/content/unsupported-browser/UnsupportedBrowser';

// const pathToHtml = path.resolve(__dirname, 'views/unsupported-browser.html'); // <-- notice that this will be the path in the dist directory

const paths = getPaths();
const statsFile = path.resolve(paths.buildStaticPath, 'loadable-stats.json');

const unsupportedBrowserRouter = (_: Request, res: Response) => {
  const extractor = new ChunkExtractor({
    statsFile,
    entrypoints: ['unsupportedBrowser']
  });

  const ReactApp = <UnsupportedBrowser />;

  const jsx = extractor.collectChunks(ReactApp);
  const markup = renderToString(jsx);

  const responseString = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <base href="/">
      <title>Unsupported browser</title>
      <meta name="description" content="Your browser is not supported"></meta>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${getAnalyticsScript()}
      ${extractor.getLinkTags()}
      ${extractor.getStyleTags()}
    </head>
    <body>  
      <div id="ens-app" class="ens-app">${markup}</div>
    
      ${extractor.getScriptTags()}
    </body>
    </html>
  `;

  res.send(responseString);
};

const getAnalyticsScript = () =>
  process.env.REPORT_ANALYTICS?.toLowerCase() === 'true' &&
  process.env.GOOGLE_ANALYTICS_KEY
    ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_KEY}"></script>
      <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '${process.env.GOOGLE_ANALYTICS_KEY}');
      </script>
    `
    : '';

export default unsupportedBrowserRouter;
