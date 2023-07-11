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

import { combineReducers } from 'redux';

import browser from 'src/content/app/genome-browser/state/genomeBrowserReducer';
import genome from 'src/shared/state/genome/genomeSlice';
import global from 'src/global/globalSlice';
import pageMeta from 'src/shared/state/page-meta/pageMetaSlice';
import inAppSearch from 'src/shared/state/in-app-search/inAppSearchSlice';
import communication from 'src/shared/state/communication/communicationSlice';
import speciesSelector from 'src/content/app/species-selector/state/speciesSelectorSlice';
import newSpeciesSelector from 'src/content/app/new-species-selector/state/speciesSelectorReducer';
import entityViewer from 'src/content/app/entity-viewer/state/entityViewerReducer';
import speciesPage from 'src/content/app/species/state/index';
import blast from 'src/content/app/tools/blast/state/blastReducer';

import graphqlApiSlice from 'src/shared/state/api-slices/graphqlApiSlice';
import restApiSlice from 'src/shared/state/api-slices/restSlice';

const createRootReducer = () =>
  combineReducers({
    browser,
    communication,
    pageMeta,
    inAppSearch,
    genome,
    global,
    speciesSelector,
    newSpeciesSelector, // TODO: rename to just species slector when we retire the old one
    speciesPage,
    entityViewer,
    blast,
    [graphqlApiSlice.reducerPath]: graphqlApiSlice.reducer,
    [restApiSlice.reducerPath]: restApiSlice.reducer
  });

export default createRootReducer;
