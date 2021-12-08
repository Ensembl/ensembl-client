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
import { connectRouter } from 'connected-react-router';

import browser from '../content/app/genome-browser/state/browserReducer';
import { genomeBrowserApiSlice } from '../content/app/genome-browser/state/genomeBrowserApiSlice';
import drawer from '../content/app/genome-browser/state/drawer/drawerSlice';
import genome from '../shared/state/genome/genomeReducer';
import customDownload from '../content/app/custom-download/state/customDownloadReducer';
import global from '../global/globalReducer';
import header from '../header/headerReducer';
import focusObjects from '../shared/state/focus-object/focusObjectSlice';
import inAppSearch from '../shared/state/in-app-search/inAppSearchSlice';
import communication from '../shared/state/communication/communicationSlice';
import speciesSelector from '../content/app/species-selector/state/speciesSelectorSlice';
import entityViewer from 'src/content/app/entity-viewer/state/entityViewerReducer';
import speciesPage from 'src/content/app/species/state/index';

const createRootReducer = (history: any) =>
  combineReducers({
    browser,
    drawer, // TODO: this should be moved in the browser reducer
    customDownload,
    communication,
    focusObjects,
    inAppSearch,
    genome,
    global,
    header,
    router: connectRouter(history),
    speciesSelector,
    speciesPage,
    entityViewer,

    [genomeBrowserApiSlice.reducerPath]: genomeBrowserApiSlice.reducer
  });

export const createServerSideRootReducer = () =>
  combineReducers({
    speciesSelector,
    entityViewer
  });

export default createRootReducer;
