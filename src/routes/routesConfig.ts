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

import HomePage from 'src/content/home/HomePage';
import SpeciesSelectorPage from 'src/content/app/species-selector/SpeciesSelectorPage';
import SpeciesPage from 'src/content/app/species/SpeciesPage';
import GenomeBrowserPage from 'src/content/app/genome-browser/BrowserPage';
import EntityViewerPage, {
  serverFetch as entityViewerServerFetch
} from 'src/content/app/entity-viewer/EntityViewerPage';
import CustomDownloadPage from 'src/content/app/custom-download/CustomDownloadPage';
import AboutPage from 'src/content/app/about/AboutPage';
import HelpPage from 'src/content/app/help/HelpPage';

type ServerFetchParams = {
  store: any; // FIXME: should be ServerSideReduxStore, but needs tweaking
  match: any; // FIXME: ideally, should be match type from react-router-dom; but needs its generic extended
};
export type ServerFetch = (params: ServerFetchParams) => Promise<unknown>;

type RouteConfig = {
  path: string;
  exact?: boolean;
  serverFetch?: ServerFetch;
  component: any; // :-(
};

const routes: RouteConfig[] = [
  {
    path: '/',
    exact: true,
    component: HomePage
  },
  {
    path: '/genome-browser/:genomeId?',
    component: GenomeBrowserPage
  },
  {
    path: '/species-selector',
    component: SpeciesSelectorPage
  },
  {
    path: '/species/:genomeId',
    component: SpeciesPage
  },
  {
    path: '/entity-viewer/:genomeId?/:entityId?',
    component: EntityViewerPage,
    serverFetch: entityViewerServerFetch
  },
  {
    path: '/about',
    component: AboutPage
  },
  {
    path: '/help',
    component: HelpPage
  },
  {
    path: '/custom-download',
    component: CustomDownloadPage
  }
  // TODO: when the global search component gets added
  // {
  //   path: '/search',
  //   component: GlobalSearch
  // }
];

export default routes;
