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

import entityViewerStorageService from 'src/content/app/entity-viewer/services/entity-viewer-storage-service';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEntityId
} from './entityViewerGeneralSelectors';
import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';

import { RootState } from 'src/store';

export type EntityViewerGeneralState = Readonly<{
  activeGenomeId: string | null;
  activeEntityIds: { [genomeId: string]: string };
}>;

type EntityViewerParams = {
  genomeId?: string;
  entityId?: string;
};

export const initialState: EntityViewerGeneralState = {
  activeGenomeId: null, // FIXME add entity viewer storage service
  activeEntityIds: {}
};

// TODO: rename to setActiveIds? Or setInitialData?
export const setDataFromUrl =
  (params: EntityViewerParams): ThunkAction<void, any, void, Action<string>> =>
  (dispatch, getState: () => RootState) => {
    const state = getState();
    const { genomeId, entityId } = params;

    let activeGenomeId = getEntityViewerActiveGenomeId(state);
    const activeEntityId = getEntityViewerActiveEntityId(state) || undefined;

    if (!genomeId && !activeGenomeId) {
      dispatch(setDefaultActiveGenomeId());
      activeGenomeId = getEntityViewerActiveGenomeId(state) as string;
    } else if (genomeId && genomeId !== activeGenomeId) {
      dispatch(setActiveGenomeId(genomeId)); // FIXME: check this!

      entityViewerStorageService.updateGeneralState({
        activeGenomeId: genomeId
      });
    }

    if (genomeId && entityId && entityId !== activeEntityId) {
      dispatch(
        updateActiveEntityForGenome({
          genomeId: genomeId,
          entityId
        })
      );
      entityViewerStorageService.updateGeneralState({
        activeEntityIds: { [genomeId]: entityId }
      });
    }
  };

export const setDefaultActiveGenomeId =
  (): ThunkAction<void, any, void, Action<string>> =>
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
