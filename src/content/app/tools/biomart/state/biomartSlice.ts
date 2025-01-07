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

export type BiomartRegionFilter = {
  chromosomes: BiomartFilterStringType;
  coordinates: BiomartFilterNumberType;
  expanded: boolean;
};

export type BiomartRegionFilters = 'chromosomes' | 'coordinates';

export type BiomartGeneFilter = {
  gene_types: BiomartFilterStringType;
  gene_sources: BiomartFilterStringType;
  transcript_types: BiomartFilterStringType;
  transcript_sources: BiomartFilterStringType;
  gene_stable_id: BiomartFilterStringType;
  transcript_stable_id: BiomartFilterStringType;
  expanded: boolean;
};

export type BiomartGeneFilters =
  | 'gene_types'
  | 'gene_sources'
  | 'transcript_types'
  | 'transcript_sources'
  | 'gene_stable_id'
  | 'transcript_stable_id';

export type BiomartFilter = {
  region: BiomartRegionFilter;
  gene: BiomartGeneFilter;
};

export type BiomartFilterKey = keyof BiomartFilter;

export type BiomartJob = {
  id: string;
  status: string;
  format: string;
  species: CommittedItem;
  filters: BiomartFilter;
  columns: BiomartTable[];
  timestamp: string;
  result_location: string;
};

export type BiomartState = {
  selectedSpecies: CommittedItem | null;
  tab: 'tables' | 'filters';
  columnSelectionData: BiomartTable[];
  filterData: BiomartFilter;
  previewRunOpen: boolean;
  jobs: BiomartJob[];
};

export const initialState: BiomartState = {
  selectedSpecies: null,
  tab: 'tables',
  columnSelectionData: [],
  filterData: {} as BiomartFilter,
  previewRunOpen: false,
  jobs: []
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
    },
    setPreviewRunOpen: (state, action: PayloadAction<boolean>) => {
      state.previewRunOpen = action.payload;
    },
    resetColumnSelectionData: (state) => {
      const newData = state.columnSelectionData.map((item) => {
        return {
          ...item,
          expanded: false,
          options: item.options.map((option) => {
            return {
              ...option,
              checked: false
            };
          })
        };
      });
      state.columnSelectionData = newData;
    },
    resetFilterData: (state) => {
      const data = state.filterData;
      const newData = {
        ...data,
        region: {
          ...data.region,
          expanded: false,
          chromosomes: {
            ...data.region.chromosomes,
            expanded: false,
            output: []
          },
          coordinates: {
            ...data.region.coordinates,
            expanded: false,
            output: []
          }
        },
        gene: {
          ...data.gene,
          expanded: false,
          gene_sources: {
            ...data.gene.gene_sources,
            expanded: false,
            output: []
          },
          gene_types: {
            ...data.gene.gene_types,
            expanded: false,
            output: []
          },
          transcript_sources: {
            ...data.gene.transcript_sources,
            expanded: false,
            output: []
          },
          transcript_types: {
            ...data.gene.transcript_types,
            expanded: false,
            output: []
          },
          gene_stable_id: {
            input: [],
            expanded: false,
            output: [],
            bm_backend_key: 'filter_gene_stable_id'
          },
          transcript_stable_id: {
            input: [],
            expanded: false,
            output: [],
            bm_backend_key: 'filter_transcript_stable_id'
          }
        }
      };
      state.filterData = newData;
    },
    setJob: (state, action: PayloadAction<BiomartJob>) => {
      state.jobs.push(action.payload);
    },
    updateJobData: (state, action: PayloadAction<BiomartJob>) => {
      const updatedJob = action.payload;
      const jobIndex = state.jobs.findIndex((job) => job.id === updatedJob.id);
      if (jobIndex !== -1) {
        state.jobs[jobIndex] = updatedJob;
      }
    }
  }
});

export const {
  setSelectedSpecies,
  setTab,
  setColumnSelectionData,
  setFilterData,
  setPreviewRunOpen,
  resetColumnSelectionData,
  resetFilterData,
  setJob,
  updateJobData
} = biomartSlice.actions;
export default biomartSlice.reducer;
