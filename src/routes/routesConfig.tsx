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

import HomePage, {
  serverFetch as homePageServerFetch
} from 'src/content/home/HomePage';
import SpeciesSelectorPage, {
  serverFetch as speciesSelectorServerFetch
} from 'src/content/app/species-selector/SpeciesSelectorPage';
import SpeciesPage, {
  serverFetch as speciesPageServerFetch
} from 'src/content/app/species/SpeciesPage';
import GenomeBrowserPage, {
  serverFetch as genomeBrowserPageServerFetch
} from 'src/content/app/genome-browser/BrowserPage';
import EntityViewerPage, {
  serverFetch as entityViewerServerFetch
} from 'src/content/app/entity-viewer/EntityViewerPage';
import ActivityViewerPage from 'src/content/app/regulatory-activity-viewer/RegulatoryActivityViewerPage';
import BlastPage, {
  serverFetch as blastServerFetch
} from 'src/content/app/tools/blast/BlastPage';
import VepPage, {
  serverFetch as vepServerFetch
} from 'src/content/app/tools/vep/VepPage';
import AboutPage, {
  serverFetch as aboutPageServerFetch
} from 'src/content/app/about/AboutPage';
import HelpPage, {
  serverFetch as helpPageServerFetch
} from 'src/content/app/help/HelpPage';
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
    element: <HomePage />,
    serverFetch: homePageServerFetch
  },
  {
    path: '/genome-browser/*',
    element: <GenomeBrowserPage />,
    serverFetch: genomeBrowserPageServerFetch
  },
  {
    path: '/species-selector/*',
    element: <SpeciesSelectorPage />,
    serverFetch: speciesSelectorServerFetch
  },
  {
    path: '/species/:genomeId',
    element: <SpeciesPage />,
    serverFetch: speciesPageServerFetch
  },
  {
    path: '/entity-viewer/*',
    element: <EntityViewerPage />,
    serverFetch: entityViewerServerFetch
  },
  {
    path: '/activity-viewer/*',
    element: <ActivityViewerPage />
  },
  {
    path: '/blast/*',
    element: <BlastPage />,
    serverFetch: blastServerFetch
  },
  {
    path: '/vep/*',
    element: <VepPage />,
    serverFetch: vepServerFetch
  },
  {
    path: '/about/*',
    element: <AboutPage />,
    serverFetch: aboutPageServerFetch
  },
  {
    path: '/help/*',
    element: <HelpPage />,
    serverFetch: helpPageServerFetch
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
