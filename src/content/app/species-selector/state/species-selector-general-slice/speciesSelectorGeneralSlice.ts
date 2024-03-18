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

import {
  createSlice,
  createAction,
  createAsyncThunk,
  type PayloadAction,
  type ThunkAction,
  type Action
} from '@reduxjs/toolkit';

import {
  getAllSelectedSpecies,
  saveMultipleSelectedSpecies,
  deleteSelectedSpeciesById
} from 'src/content/app/species-selector/services/speciesSelectorStorageService';

// WHERE IS DELETION HAPPENING?
import { deleteSpeciesInGenomeBrowser } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import { deleteGenome as deleteSpeciesInEntityViewer } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSlice';

import {
  getCommittedSpecies,
  getCommittedSpeciesById
} from './speciesSelectorGeneralSelectors';

import type { RootState } from 'src/store';
import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import type { SpeciesSearchMatch } from 'src/content/app/species-selector/types/speciesSearchMatch';

export type SpeciesSelectorState = {
  committedItems: CommittedItem[];
};

// TODO: investigate
export const fetchSpeciesSearchResults = createAction<string>(
  'species-selector/fetchSpeciesSearchResults'
);

export const loadStoredSpecies = createAsyncThunk(
  'species-selector/loadStoredSpecies',
  async () => {
    return await getAllSelectedSpecies();
  }
);

export const toggleSpeciesUseAndSave =
  (genomeId: string): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const state = getState();
    const committedSpecies = getCommittedSpecies(state);
    const currentSpecies = getCommittedSpeciesById(state, genomeId);
    if (!currentSpecies) {
      return; // should never happen
    }
    const updatedCommittedSpecies = committedSpecies.map((item) => {
      return item.genome_id === genomeId
        ? {
            ...item,
            isEnabled: !item.isEnabled
          }
        : item;
    });

    dispatch(updateCommittedSpecies(updatedCommittedSpecies));
    saveMultipleSelectedSpecies(updatedCommittedSpecies);
  };

export const deleteSpeciesAndSave =
  (genomeId: string): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const committedSpecies = getCommittedSpecies(getState());
    const updatedCommittedSpecies = committedSpecies.filter(
      ({ genome_id }) => genome_id !== genomeId
    );

    dispatch(updateCommittedSpecies(updatedCommittedSpecies));
    dispatch(deleteSpeciesInGenomeBrowser(genomeId));
    dispatch(deleteSpeciesInEntityViewer(genomeId));
    deleteSelectedSpeciesById(genomeId);
  };

const initialState: SpeciesSelectorState = {
  committedItems: []
};

const prepareSelectedSpeciesForCommit = (
  selectedSpecies: SpeciesSearchMatch[]
): CommittedItem[] => {
  return selectedSpecies.map((species) => ({
    genome_id: species.genome_id,
    genome_tag: species.genome_tag,
    common_name: species.common_name,
    scientific_name: species.scientific_name,
    species_taxonomy_id: species.species_taxonomy_id,
    assembly: {
      accession_id: species.assembly.name,
      name: species.assembly.name
    },
    is_reference: species.is_reference,
    type: species.type,
    isEnabled: true
  }));
};

export const commitSelectedSpeciesAndSave = createAsyncThunk(
  'species-selector/commit-selected-species',
  (selectedSpecies: SpeciesSearchMatch[], thunkAPI) => {
    const dispatch = thunkAPI.dispatch;
    const getState = thunkAPI.getState as () => RootState;
    const alreadyCommittedSpecies = getCommittedSpecies(getState());
    const newSpeciesToCommit = prepareSelectedSpeciesForCommit(selectedSpecies);

    const newCommittedSpecies = [
      ...alreadyCommittedSpecies,
      ...newSpeciesToCommit
    ];

    dispatch(updateCommittedSpecies(newCommittedSpecies));

    saveMultipleSelectedSpecies(newCommittedSpecies);
  }
);

const speciesSelectorGeneralSlice = createSlice({
  name: 'species-selector-general',
  initialState,
  reducers: {
    updateCommittedSpecies(state, action: PayloadAction<CommittedItem[]>) {
      state.committedItems = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadStoredSpecies.fulfilled, (state, action) => {
      state.committedItems = action.payload;
    });
  }
});

export const { updateCommittedSpecies } = speciesSelectorGeneralSlice.actions;

export default speciesSelectorGeneralSlice.reducer;
