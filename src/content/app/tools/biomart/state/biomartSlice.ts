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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

type BiomartColumn = {
  label: string;
  name: string;
  checked: boolean;
};

export type BiomartTable = {
  label: string;
  options: BiomartColumn[];
  expanded: boolean;
};

export type BiomartFilterStringType = {
  input: string[];
  bm_backend_key: string;
  output: string[];
  expanded: boolean;
};

export type BiomartFilterNumberType = {
  input: number[];
  bm_backend_key: string;
  output: number[];
  expanded: boolean;
};

type BiomartRegionFilter = {
  chromosomes: BiomartFilterStringType;
  coordinates: BiomartFilterNumberType;
  expanded: boolean;
};

export type BiomartRegionFilters = 'chromosomes' | 'coordinates';

type BiomartGeneFilter = {
  gene_types: BiomartFilterStringType;
  gene_sources: BiomartFilterStringType;
  transcript_types: BiomartFilterStringType;
  transcript_sources: BiomartFilterStringType;
  expanded: boolean;
};

export type BiomartGeneFilters =
  | 'gene_types'
  | 'gene_sources'
  | 'transcript_types'
  | 'transcript_sources';

export type BiomartFilter = {
  region: BiomartRegionFilter;
  gene: BiomartGeneFilter;
};

export type BiomartFilterKey = keyof BiomartFilter;

export type BiomartState = {
  selectedSpecies: CommittedItem | null;
  tab: 'tables' | 'filters';
  columnSelectionData: BiomartTable[];
  filterData: BiomartFilter;
};

export const initialState: BiomartState = {
  selectedSpecies: null,
  tab: 'tables',
  columnSelectionData: [],
  filterData: {} as BiomartFilter
};

const biomartSlice = createSlice({
  name: 'biomart',
  initialState,
  reducers: {
    setSelectedSpecies: (
      state,
      action: PayloadAction<CommittedItem | null>
    ) => {
      state.selectedSpecies = action.payload;
    },
    setTab: (state, action: PayloadAction<'tables' | 'filters'>) => {
      state.tab = action.payload;
    },
    setColumnSelectionData: (state, action: PayloadAction<BiomartTable[]>) => {
      state.columnSelectionData = action.payload;
    },
    setFilterData: (state, action: PayloadAction<BiomartFilter>) => {
      state.filterData = action.payload;
    }
  }
});

export const {
  setSelectedSpecies,
  setTab,
  setColumnSelectionData,
  setFilterData
} = biomartSlice.actions;
export default biomartSlice.reducer;
