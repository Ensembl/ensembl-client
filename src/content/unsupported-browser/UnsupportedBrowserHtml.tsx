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

import type { TransferredClientConfig } from 'src/server/helpers/getConfigForClient';
import type JSONValue from 'src/shared/types/JSON';

type Props = {
  assets: Record<string, string>;
  serverSideConfig: JSONValue;
  children: ReactNode;
};

const Html = (props: Props) => {
  const { assets, serverSideConfig, children } = props;

  // NOTE: unsupportedBrowser.css below will only be extracted into own file by webpack in production.

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <base href="/" />
        <title>Unsupported browser</title>
        <meta name="description" content="Your browser is not supported" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {assets['unsupportedBrowser.css'] && (
          <link rel="stylesheet" href={assets['unsupportedBrowser.css']} />
        )}
        {shouldReportAnalytics(serverSideConfig) && (
          <GoogleAnalyticsScript config={serverSideConfig} />
        )}
      </head>
      <body>
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

const shouldReportAnalytics = (config: Partial<TransferredClientConfig>) =>
  config?.environment?.shouldReportAnalytics ?? false;

const getGoogleAnalyticsKey = (config: Partial<TransferredClientConfig>) =>
  config?.keys?.googleAnalyticsKey ?? '';

const GoogleAnalyticsScript = (props: { config: JSONValue }) => {
  const gaKey = getGoogleAnalyticsKey(props.config);

  if (shouldReportAnalytics(props.config) && gaKey) {
    const gaUrl = `https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS_KEY}`;
    const initScript = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', '${process.env.GOOGLE_ANALYTICS_KEY}');
    `;

    return (
      <>
        <script async={true} src={gaUrl} />
        <script dangerouslySetInnerHTML={{ __html: initScript }} />
      </>
    );
  } else {
    return null;
  }
};

export default Html;
