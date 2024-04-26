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

import type { ReactNode } from 'react';

import { CONFIG_FIELD_ON_WINDOW } from 'src/shared/constants/globals';

import Meta from './Meta';
import { HotjarScript } from './ThirdParty';

import type JSONValue from 'src/shared/types/JSON';
import type { TransferredClientConfig } from 'src/server/helpers/getConfigForClient';

type Props = {
  assets: Record<string, string>;
  serverSideReduxState: JSONValue; // redux state that is generated on the server and is passed over to the client
  serverSideConfig: Partial<TransferredClientConfig>;
  children: ReactNode;
};

const Html = (props: Props) => {
  const { assets, serverSideReduxState, serverSideConfig, children } = props;

  const shouldReportAnalytics =
    serverSideConfig.environment?.shouldReportAnalytics;

  const windowPreloadStateString = `window.__PRELOADED_STATE__ = ${JSON.stringify(
    serverSideReduxState
  )};`;
  const configString = `window.${CONFIG_FIELD_ON_WINDOW} = ${JSON.stringify(
    serverSideConfig
  )};`;

  // NOTE: client.css file below will only be extracted by webpack in production.

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <base href="/" />
        <Meta />
        {assets['client.css'] && (
          <link rel="stylesheet" href={assets['client.css']} />
        )}
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
            __html: `<b>Please enable javascript to view the Ensembl app</b>`
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
