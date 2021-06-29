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

import { createSlice, PayloadAction, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';

import {
  buildEnsObjectId,
  parseFocusIdFromUrl
} from 'src/shared/state/ens-object/ensObjectHelpers';

import entityViewerStorageService from 'src/content/app/entity-viewer/services/entity-viewer-storage-service';

import { fetchGenomeData } from 'src/shared/state/genome/genomeActions';
import { ensureSpeciesIsEnabled } from 'src/content/app/species-selector/state/speciesSelectorActions';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEntityId
} from './entityViewerGeneralSelectors';
import { getGenomeInfoById } from 'src/shared/state/genome/genomeSelectors';
import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import { EntityViewerParams } from 'src/content/app/entity-viewer/EntityViewer';
import { RootState } from 'src/store';

export type EntityViewerGeneralState = Readonly<{
  activeGenomeId: string | null;
  activeEntityIds: { [genomeId: string]: string };
}>;

export const initialState: EntityViewerGeneralState = {
  activeGenomeId: null, // FIXME add entity viewer storage service
  activeEntityIds: {}
};

export const setDataFromUrl =
  (params: EntityViewerParams): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
    const state = getState();
    const { genomeId: genomeIdFromUrl } = params;

    let activeGenomeId = getEntityViewerActiveGenomeId(state);
    const activeEntityId = getEntityViewerActiveEntityId(state) || undefined;

    if (!genomeIdFromUrl && !activeGenomeId) {
      dispatch(setDefaultActiveGenomeId());
      activeGenomeId = getEntityViewerActiveGenomeId(state) as string;
    } else if (genomeIdFromUrl && genomeIdFromUrl !== activeGenomeId) {
      dispatch(setActiveGenomeId(genomeIdFromUrl));
      dispatch(fetchGenomeData(genomeIdFromUrl));
      dispatch(ensureSpeciesIsEnabled(genomeIdFromUrl));

      // TODO: when backend is ready, entity info may also need fetching
    } else if (activeGenomeId) {
      // TODO: when backend is ready, fetch entity info
      const genomeInfo = getGenomeInfoById(state, activeGenomeId);
      if (!genomeInfo) {
        dispatch(fetchGenomeData(activeGenomeId));
      }
      dispatch(ensureSpeciesIsEnabled(activeGenomeId));
    }

    const entityId = params.entityId
      ? buildEnsObjectId({
          genomeId: genomeIdFromUrl as string,
          ...parseFocusIdFromUrl(params.entityId)
        })
      : null;

    if (entityId && genomeIdFromUrl) {
      if (entityId !== activeEntityId) {
        dispatch(
          updateActiveEntityForGenome({
            genomeId: genomeIdFromUrl,
            entityId
          })
        );
      }

      entityViewerStorageService.updateGeneralState({
        activeGenomeId: genomeIdFromUrl
      });

      entityViewerStorageService.updateGeneralState({
        activeEntityIds: { [genomeIdFromUrl]: entityId }
      });
    }
  };

export const setDefaultActiveGenomeId =
  (): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
    const state = getState();
    const [firstCommittedSpecies] = getCommittedSpecies(state);
    const activeGenomeId = firstCommittedSpecies?.genome_id;
    activeGenomeId && dispatch(setActiveGenomeId(activeGenomeId));
  };

const entityViewerGeneralSlice = createSlice({
  name: 'entity-viewer-general',
  initialState,
  reducers: {
    loadInitialState() {
      const savedState = entityViewerStorageService.getGeneralState();
      if (savedState) {
        return savedState as EntityViewerGeneralState;
      }
    },
    setActiveGenomeId(state, action: PayloadAction<string>) {
      state.activeGenomeId = action.payload;
    },
    updateActiveEntityForGenome(
      state,
      action: PayloadAction<{ genomeId: string; entityId: string }>
    ) {
      const { genomeId, entityId } = action.payload;
      state.activeEntityIds[genomeId] = entityId;
    },
    deleteGenome(state, action: PayloadAction<string>) {
      const genomeId = action.payload;
      delete state.activeEntityIds[genomeId];
      if (genomeId === state.activeGenomeId) {
        state.activeGenomeId = null;
      }
      entityViewerStorageService.deleteGenome(genomeId);
    }
  }
});

export const {
  loadInitialState,
  setActiveGenomeId,
  updateActiveEntityForGenome,
  deleteGenome
} = entityViewerGeneralSlice.actions;

export default entityViewerGeneralSlice.reducer;
