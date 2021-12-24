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

import HomePage from 'src/content/home/HomePage';
import SpeciesSelectorPage from 'src/content/app/species-selector/SpeciesSelectorPage';
import SpeciesPage from 'src/content/app/species/SpeciesPage';
import GenomeBrowserPage from 'src/content/app/genome-browser/BrowserPage';
import EntityViewerPage, {
  serverFetch as entityViewerServerFetch
} from 'src/content/app/entity-viewer/EntityViewerPage';
import BlastPage from 'src/content/app/tools/blast/BlastPage';
import CustomDownloadPage from 'src/content/app/custom-download/CustomDownloadPage';
import AboutPage from 'src/content/app/about/AboutPage';
import HelpPage from 'src/content/app/help/HelpPage';
import { NotFoundErrorScreen } from 'src/shared/components/error-screen';

type ServerFetchParams = {
  store: any; // FIXME: should be ServerSideReduxStore, but needs tweaking
  path: string;
};
export type ServerFetch = (params: ServerFetchParams) => Promise<unknown>;

export type RouteConfig = {
  path: string;
  element: ReactNode;
  serverFetch?: ServerFetch;
};

const routes: RouteConfig[] = [
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/genome-browser/*',
    element: <GenomeBrowserPage />
  },
  {
    path: '/species-selector',
    element: <SpeciesSelectorPage />
  },
  {
    path: '/species/:genomeId',
    element: <SpeciesPage />
  },
  {
    path: '/entity-viewer/*',
    element: <EntityViewerPage />,
    serverFetch: entityViewerServerFetch
  },
  {
    path: '/blast',
    element: <BlastPage />
  },
  {
    path: '/about/*',
    element: <AboutPage />
  },
  {
    path: '/help/*',
    element: <HelpPage />
  },
  {
    path: '/custom-download',
    element: <CustomDownloadPage />
  },
  {
    path: '*',
    element: <NotFoundErrorScreen />
  }
  // TODO: when the global search component gets added
  // {
  //   path: '/search',
  //   component: GlobalSearch
  // }
];

export default routes;
