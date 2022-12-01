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

import React, { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import ensureBrowserSupport from 'src/shared/helpers/browserSupport';
import { CONFIG_FIELD_ON_WINDOW } from 'src/shared/constants/globals';

import { Provider as IndexedDBProvider } from 'src/shared/contexts/IndexedDBContext';
import configureStore from './store';

import Html from 'src/content/html/Html';
import Root from './root/Root';

import { registerSW } from './registerServiceWorker';

import type { TransferredClientConfig } from 'src/server/helpers/getConfigForClient';

import './styles/main';

ensureBrowserSupport();

const store = configureStore();

const assetManifest = (globalThis as any).assetManifest || {};
const serverSideReduxState = (globalThis as any).__PRELOADED_STATE__ ?? {};
const serverSideConfig: Partial<TransferredClientConfig> =
  (globalThis as any)[CONFIG_FIELD_ON_WINDOW] ?? {};

hydrateRoot(
  document,
  <StrictMode>
    <IndexedDBProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Html
            assets={assetManifest}
            serverSideReduxState={serverSideReduxState}
            serverSideConfig={serverSideConfig}
          >
            <Root />
          </Html>
        </BrowserRouter>
      </Provider>
    </IndexedDBProvider>
  </StrictMode>
);

if (serverSideConfig.environment?.buildEnvironment === 'production') {
  registerSW();
}

// TODO: investigate react-refresh with react-refresh-webpack-plugin
// (see https://github.com/pmmmwh/react-refresh-webpack-plugin
// and this StackOverflow discussion: https://stackoverflow.com/a/71914061/3925302)
