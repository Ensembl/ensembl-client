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

import { useEffect } from 'react';

import { useAppDispatch } from 'src/store';

import { loadStoredSpecies } from 'src/content/app/species-selector/state/speciesSelectorSlice';
import { loadPreviouslyViewedEntities } from 'src/content/app/entity-viewer/state/bookmarks/entityViewerBookmarksSlice';
import { restoreUI as restoreSpeciesPageUI } from 'src/content/app/species/state/general/speciesGeneralSlice';
import { loadInitialState as loadEntityViewerGeneralState } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSlice';
import { restoreGeneViewTranscripts } from 'src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';
import { loadBrowserGeneralState } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import { loadPreviouslyViewedObjects as loadPreviouslyViewedGenomeBrowserObjects } from 'src/content/app/genome-browser/state/browser-bookmarks/browserBookmarksSlice';
import { loadTrackConfigsState } from 'src/content/app/genome-browser/state/track-config/trackConfigSlice';

// load redux state from browser storage once when the application mounts
const useRestoredReduxState = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Species Selector
    dispatch(loadStoredSpecies());

    // Species Page
    dispatch(restoreSpeciesPageUI());

    // Genome browser
    dispatch(loadBrowserGeneralState());
    dispatch(loadPreviouslyViewedGenomeBrowserObjects());
    dispatch(loadTrackConfigsState());

    // Entity Viewer
    dispatch(loadPreviouslyViewedEntities());
    dispatch(loadEntityViewerGeneralState());
    dispatch(restoreGeneViewTranscripts());
  }, []);
};

export default useRestoredReduxState;
