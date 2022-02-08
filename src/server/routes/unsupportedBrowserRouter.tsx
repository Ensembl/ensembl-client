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

import config from 'config';

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
      <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', '${config.googleAnalyticsKey}', 'auto');
        ga('send', 'pageview');
      </script>
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

export default unsupportedBrowserRouter;
