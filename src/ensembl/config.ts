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

export type BaseApiUrls = {
  thoasBaseUrl: string;
  genomeSearchBaseUrl: string;
  docsBaseUrl: string;
  genomeBrowserBackendBaseUrl: string;
  refgetBaseUrl: string;
  customDownloadGeneSearch: string;
};

export type PublicKeys = {
  googleAnalyticsKey: string;
};

const defaultApiUrls: BaseApiUrls = {
  thoasBaseUrl: 'https://2020.ensembl.org/api/thoas',
  genomeSearchBaseUrl: 'https://2020.ensembl.org/api/genomesearch',
  docsBaseUrl: 'https://2020.ensembl.org/api/docs',
  genomeBrowserBackendBaseUrl:
    'http://genome-browser-service.review.ensembl.org/api/data',
  refgetBaseUrl: '/api/refget',
  customDownloadGeneSearch: ''
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
    thoasBaseUrl: process.env.SSR_THOAS_BASE_URL ?? defaultApiUrls.thoasBaseUrl,
    genomeSearchBaseUrl:
      process.env.SSR_GENOME_SEARCH_BASE_URL ??
      defaultApiUrls.genomeBrowserBackendBaseUrl,
    docsBaseUrl: process.env.SSR_DOCS_BASE_URL ?? defaultApiUrls.docsBaseUrl,
    genomeBrowserBackendBaseUrl: defaultApiUrls.genomeBrowserBackendBaseUrl, // irrelevant for server-side rendering
    refgetBaseUrl: defaultApiUrls.refgetBaseUrl, // irrelevant for server-side rendering
    customDownloadGeneSearch: defaultApiUrls.customDownloadGeneSearch // irrelevant for server-side rendering
  };
};

const getKeys = (): PublicKeys => {
  if (isClient()) {
    return (window as any)[CONFIG_FIELD_ON_WINDOW]?.keys || defaultKeys;
  }

  return defaultKeys;
};

const buildEnvironment = readEnvironment().buildEnvironment;

export default {
  // Version numbers
  app_version: '0.4.0',

  // build environment
  isDevelopment: buildEnvironment === 'development',
  isProduction: buildEnvironment !== 'development',

  // TODO: remove this from the config in the future (will require refactoring of the apiService)
  // We will instead be passing base urls for differeent microservices individually
  apiHost: '',

  // Genesearch endpoint (used by Custom Download)
  // TODO: change the name of this field to something returned from getBaseApiUrls when we continue work on Custom Download
  genesearchAPIEndpoint: getBaseApiUrls().customDownloadGeneSearch,

  ...getBaseApiUrls(),
  ...getKeys()
};
