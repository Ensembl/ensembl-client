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

import React, { type ReactNode } from 'react';

import { CONFIG_FIELD_ON_WINDOW } from 'src/shared/constants/globals';

import Meta from './Meta';
import { HotjarScript } from './ThirdParty';

import type JSONValue from 'src/shared/types/JSON';

type Props = {
  assets: Record<string, string>;
  serverSideReduxState: JSONValue; // redux state that is generated on the server and is passed over to the client
  serverSideConfig: JSONValue;
  children: ReactNode;
};

// QUESTION: where does the metadata go?

/**
   <meta name="viewport" content="width=device-width, initial-scale=1" />
   <link rel="shortcut icon" href="favicon.ico" />
 */

/**
 * DONE:
 * - Updated viewRouter (server-side) to use the new React `renderToPipeableStream` api
 * - Created the HTML component to give React full control over the whole HTML document
 * (based on Dan Abramov's example sandbox: https://codesandbox.io/s/kind-sammet-j56ro)
 * - Added webpack-manifest-plugin to be able to read webpack manifest on the server, and inject it into the html
 * - Updated eslint-plugin-react to make it aware of the noModule attribute on the script tag
 *
 *
 * What we will have achieved in the result:
 * - Remove dependency on react-helmet-async
 * - Remove dependency on the loadable-component package, which hasn't been updated for React 18. This should remove some of the console warnings
 *
 * TODO:
 * - Wire up redux to use for title and metadata
 * - Do not forget third-party scripts
 * - Only keep the relevant fields from the assets manifest before transferring it to client
 * - Remove all loadable-component code; use React.lazy instead
 * - Remove all React Helmet code
 * - Make sure favicon works (especially in prod build)
 * - Remove packages:
 *    - @loadable/component
 *    - @loadable/server
 *    - react-helmet-async
 *    - typesafe-actions
 *    - @loadable/babel-plugin
 *    - @loadable/webpack-plugin
 *    - @types/loadable__component
 *    - @types/loadable__server
 *    - @types/loadable__webpack-plugin
 *
 * Useful links:
 * - StackOverflow discussion of hot module replacement with React 18: https://stackoverflow.com/a/71914061/3925302
 */

const Html = (props: Props) => {
  const { assets, serverSideReduxState, serverSideConfig, children } = props;

  const { shouldReportAnalytics } = serverSideConfig;

  const windowPreloadStateString = `window.__PRELOADED_STATE__ = ${JSON.stringify(
    serverSideReduxState
  )};`;
  const configString = `window.${CONFIG_FIELD_ON_WINDOW} = ${JSON.stringify(
    serverSideConfig
  )};`;

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <base href="/" />
        <Meta />
        <link rel="stylesheet" href={assets['client.css']} />
        <script
          noModule={true}
          dangerouslySetInnerHTML={{
            __html: `window.location.replace("/unsupported-browser");`
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `${windowPreloadStateString} ${configString}`
          }}
        />
        {shouldReportAnalytics && <HotjarScript />}
      </head>
      <body>
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<b>Enable JavaScript to run this app.</b>`
          }}
        />

        {children}

        <script
          dangerouslySetInnerHTML={{
            __html: `window.assetManifest = ${JSON.stringify(assets)};`
          }}
        />
      </body>
    </html>
  );
};

export default Html;
