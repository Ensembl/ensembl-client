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

import { isClient } from 'src/shared/helpers/environment';

export const CONFIG_FIELD_ON_WINDOW = '__CONFIG__';

export type BaseApiUrls = {
  thoasBaseUrl: string;
  genomeSearchBaseUrl: string;
  docsBaseUrl: string;
  genomeBrowserBaseUrl: string;
  refgetBaseUrl: string;
};

const getBaseApiUrls = (): BaseApiUrls => {
  if (isClient()) {
    return (window as any)[CONFIG_FIELD_ON_WINDOW]?.apiPaths;
  }

  // the following will be run on the server
  return {
    thoasBaseUrl:
      process.env.SSR_THOAS_BASE_URL ?? 'https://2020.ensembl.org/api/thoas',
    genomeSearchBaseUrl:
      process.env.SSR_GENOME_SEARCH_BASE_URL ??
      'https://2020.ensembl.org/api/genomesearch',
    docsBaseUrl:
      process.env.SSR_DOCS_BASE_URL ?? 'https://2020.ensembl.org/api/docs',
    genomeBrowserBaseUrl: '/api/browser', // irrelevant for server-side rendering
    refgetBaseUrl: '/api/refget' // irrelevant for server-side rendering
  };
};

export default {
  // Version numbers
  app_version: '0.4.0',

  // Node environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  apiHost: process.env.API_HOST || '',

  // Keys for services
  googleAnalyticsKey: process.env.GOOGLE_ANALYTICS_KEY || '',

  // Genesearch endpoint (used by Custom Download)
  // TODO: move this endpoint into the getBaseApiUrls function when the time comes
  genesearchAPIEndpoint: process.env.GENESEARCH_API_ENDPOINT,

  ...getBaseApiUrls()
};
