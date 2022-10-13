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

// get base urls for the apis to be used by the client
import type { BaseApiUrls } from 'config';

const getBaseApiUrls = (): BaseApiUrls => {
  return {
    thoasBaseUrl: process.env.BROWSER_THOAS_BASE_URL ?? '/api/thoas',
    genomeSearchBaseUrl:
      process.env.BROWSER_GENOME_SEARCH_BASE_URL ?? '/api/genomesearch',
    docsBaseUrl: process.env.BROWSER_DOCS_BASE_URL ?? '/api/docs',
    refgetBaseUrl: process.env.REFGET_BASE_URL ?? '/api/refget',
    tracksApiBaseUrl: '/api/tracks',
    genomeBrowserBackendBaseUrl:
      process.env.GENOME_BROWSER_BACKEND_BASE_URL ?? '/api/browser/data',
    toolsApiBaseUrl: process.env.TOOLS_API_BASE_URL ?? '/api/tools'
  };
};

const getEnvironment = () => {
  return {
    buildEnvironment: process.env.NODE_ENV ?? 'production',
    deploymentEnvironment: process.env.ENVIRONMENT ?? 'development',
    shouldReportAnalytics: shouldReportAnalytics(),
    shouldReportErrors: shouldReportErrors()
  };
};

const getKeys = () => {
  return {
    googleAnalyticsKey: process.env.GOOGLE_ANALYTICS_KEY ?? ''
  };
};

const shouldReportAnalytics = () =>
  `${process.env.REPORT_ANALYTICS}`.toLowerCase() === 'true';

const shouldReportErrors = () =>
  `${process.env.REPORT_ERRORS}`.toLowerCase() === 'true';

export const getConfigForClient = () => {
  return {
    apiPaths: getBaseApiUrls(),
    environment: getEnvironment(),
    keys: getKeys()
  };
};
