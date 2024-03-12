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
  createAsyncThunk,
  type PayloadAction
} from '@reduxjs/toolkit';

import { saveMultipleSelectedSpecies } from 'src/content/app/species-selector/services/speciesSelectorStorageService';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import { updateCommittedSpecies } from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSlice';

import type { RootState } from 'src/store';
import type { SpeciesSearchMatch } from 'src/content/app/species-selector/types/speciesSearchMatch';
import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

type State = {
  query: string;
};

const initialState: State = {
  query: ''
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

const speciesSelectorSearchSlice = createSlice({
  name: 'species-selector-search',
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(commitSelectedSpeciesAndSave.fulfilled, (state) => {
      state.query = '';
    });
  }
});

export const { setQuery } = speciesSelectorSearchSlice.actions;

export default speciesSelectorSearchSlice.reducer;
