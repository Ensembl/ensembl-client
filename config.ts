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

import { isClient, readEnvironment } from 'src/shared/helpers/environment';
import { CONFIG_FIELD_ON_WINDOW } from 'src/shared/constants/globals';
import { hostWithProtocol as defaultServerHost } from 'src/server/constants';

export type BaseApiUrls = {
  coreApiUrl: string;
  metadataApiBaseUrl: string;
  comparaApiBaseUrl: string;
  docsBaseUrl: string;
  genomeBrowserBackendBaseUrl: string;
  refgetBaseUrl: string;
  tracksApiBaseUrl: string;
  toolsApiBaseUrl: string;
  searchApiBaseUrl: string;
  variationApiUrl: string;
};

export type PublicKeys = {
  googleAnalyticsKey: string;
};

const defaultApiUrls: BaseApiUrls = {
  coreApiUrl: '/api/graphql/core',
  metadataApiBaseUrl: '/api/metadata',
  comparaApiBaseUrl: '/api/graphql/compara',
  docsBaseUrl: '/api/docs',
  genomeBrowserBackendBaseUrl: '/api/browser/data',
  refgetBaseUrl: '/api/refget',
  tracksApiBaseUrl: '/api/tracks',
  toolsApiBaseUrl: '/api/tools',
  searchApiBaseUrl: '/api/search',
  variationApiUrl: '/api/graphql/variation'
};

const defaultKeys = {
  googleAnalyticsKey: ''
};

const getBaseApiUrls = (): BaseApiUrls => {
  if (isClient()) {
    return (window as any)[CONFIG_FIELD_ON_WINDOW]?.apiPaths ?? defaultApiUrls;
  }

  // the following will be run on the server
  return {
    coreApiUrl:
      globalThis.process?.env.SSR_CORE_API_BASE_URL ??
      `${defaultServerHost}${defaultApiUrls.coreApiUrl}`,
    docsBaseUrl:
      globalThis.process?.env.SSR_DOCS_BASE_URL ??
      `${defaultServerHost}${defaultApiUrls.docsBaseUrl}`,
    variationApiUrl:
      globalThis.process?.env.SSR_VARIATION_GRAPHQL_API_URL ??
      `${defaultServerHost}${defaultApiUrls.variationApiUrl}`,
    metadataApiBaseUrl:
      globalThis.process?.env.SSR_METADATA_API_URL ??
      `${defaultServerHost}${defaultApiUrls.metadataApiBaseUrl}`,
    comparaApiBaseUrl: defaultApiUrls.comparaApiBaseUrl, // irrelevant for server-side rendering
    genomeBrowserBackendBaseUrl: defaultApiUrls.genomeBrowserBackendBaseUrl, // irrelevant for server-side rendering
    refgetBaseUrl: defaultApiUrls.refgetBaseUrl, // irrelevant for server-side rendering
    tracksApiBaseUrl: defaultApiUrls.tracksApiBaseUrl, // irrelevant for server-side rendering
    toolsApiBaseUrl: defaultApiUrls.toolsApiBaseUrl, // irrelevant for server-side rendering
    searchApiBaseUrl: defaultApiUrls.searchApiBaseUrl // irrelevant for server-side rendering
  };
};

const getKeys = (): PublicKeys => {
  if (isClient()) {
    return (window as any)[CONFIG_FIELD_ON_WINDOW]?.keys || defaultKeys;
  }

  return defaultKeys;
};

const shouldReportAnalytics = () =>
  isClient() &&
  (window as any)[CONFIG_FIELD_ON_WINDOW]?.environment.shouldReportAnalytics;

// TODO: figure out what to do with errors that happen server-side
const shouldReportErrors = () =>
  isClient() &&
  (window as any)[CONFIG_FIELD_ON_WINDOW]?.environment.shouldReportErrors;

const buildEnvironment = readEnvironment().buildEnvironment;

export default {
  // Version numbers
  app_version: '0.4.0',

  // build environment
  isDevelopment: buildEnvironment === 'development',
  isProduction: buildEnvironment !== 'development',

  shouldReportAnalytics: shouldReportAnalytics(),
  shouldReportErrors: shouldReportErrors(),

  // TODO: remove this from the config in the future (will require refactoring of the apiService)
  // We will instead be passing base urls for differeent microservices individually
  apiHost: '',

  ...getBaseApiUrls(),
  ...getKeys()
};
