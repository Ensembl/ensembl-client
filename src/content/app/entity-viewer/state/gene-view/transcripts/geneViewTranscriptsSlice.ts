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
  createAsyncThunk,
  createSlice,
  type Action,
  type ThunkAction,
  type PayloadAction
} from '@reduxjs/toolkit';
import cloneDeep from 'lodash/cloneDeep';

import entityViewerStorageService from 'src/content/app/entity-viewer/services/entity-viewer-storage-service';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEntityId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';

import {
  getExpandedTranscriptIds,
  getExpandedTranscriptDownloadIds,
  getExpandedTranscriptMoreInfoIds
} from './geneViewTranscriptsSelectors';

import type { TranscriptMetadata } from 'src/shared/types/core-api/metadata';
import type { RootState } from 'src/store';

export enum SortingRule {
  DEFAULT = 'default',
  SPLICED_LENGTH_DESC = 'spliced_length_desc',
  SPLICED_LENGTH_ASC = 'spliced_length_asc',
  EXON_COUNT_DESC = 'exon_count_desc',
  EXON_COUNT_ASC = 'exon_count_asc'
}

export type TranscriptsStatePerGene = {
  expandedIds: string[];
  isExpandedTranscriptsListModified: boolean;
  expandedDownloadIds: string[];
  expandedMoreInfoIds: string[];
  filters: Filters;
  sortingRule: SortingRule;
  filterPanelOpen: boolean;
};

export type GeneViewTranscriptsState = {
  [genomeId: string]: {
    [geneId: string]: TranscriptsStatePerGene;
  };
};

export type StoredGeneViewTranscriptsState = {
  [genomeId: string]: {
    [geneId: string]: Partial<
      Pick<TranscriptsStatePerGene, 'filters' | 'sortingRule'>
    >;
  };
};

export type Filter = {
  label: string;
  selected: boolean;
  type: keyof Pick<TranscriptMetadata, 'tsl' | 'appris' | 'biotype'>;
};

export type Filters = Record<string, Filter>;

const defaultStatePerGene: TranscriptsStatePerGene = {
  expandedIds: [],
  isExpandedTranscriptsListModified: false,
  expandedDownloadIds: [],
  expandedMoreInfoIds: [],
  filters: {},
  sortingRule: SortingRule.DEFAULT,
  filterPanelOpen: false
};

export const resetFilterPanel =
  (): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const state = getState();
    const activeGenomeId = getEntityViewerActiveGenomeId(state);
    const activeEntityId = getEntityViewerActiveEntityId(state);
    if (!activeGenomeId || !activeEntityId) {
      return;
    }
    dispatch(
      transcriptsSlice.actions.updateFilterPanel({
        activeGenomeId,
        activeEntityId,
        filterPanelOpen: defaultStatePerGene.filterPanelOpen
      })
    );
  };

export const setFilterPanel =
  (
    filterPanelOpen: boolean
  ): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const state = getState();
    const activeGenomeId = getEntityViewerActiveGenomeId(state);
    const activeEntityId = getEntityViewerActiveEntityId(state);
    if (!activeGenomeId || !activeEntityId) {
      return;
    }
    dispatch(
      transcriptsSlice.actions.updateFilterPanel({
        activeGenomeId,
        activeEntityId,
        filterPanelOpen
      })
    );
  };

export const setFilters =
  (filters: Filters): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const state = getState();
    const activeGenomeId = getEntityViewerActiveGenomeId(state);
    const activeEntityId = getEntityViewerActiveEntityId(state);
    if (!activeGenomeId || !activeEntityId) {
      return;
    }
    dispatch(
      transcriptsSlice.actions.updateFilters({
        activeGenomeId,
        activeEntityId,
        filters
      })
    );

    entityViewerStorageService.updateGeneViewTranscriptsState({
      [activeGenomeId]: {
        [activeEntityId]: {
          filters
        }
      }
    });
  };

export const setSortingRule =
  (
    sortingRule: SortingRule
  ): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const state = getState();
    const activeGenomeId = getEntityViewerActiveGenomeId(state);
    const activeEntityId = getEntityViewerActiveEntityId(state);
    if (!activeGenomeId || !activeEntityId) {
      return;
    }

    dispatch(
      transcriptsSlice.actions.updateSortingRule({
        activeGenomeId,
        activeEntityId,
        sortingRule
      })
    );

    entityViewerStorageService.updateGeneViewTranscriptsState({
      [activeGenomeId]: {
        [activeEntityId]: {
          sortingRule
        }
      }
    });
  };

export const toggleTranscriptInfo =
  (transcriptId: string): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const state = getState();
    const activeGenomeId = getEntityViewerActiveGenomeId(state);
    const activeEntityId = getEntityViewerActiveEntityId(state);
    if (!activeGenomeId || !activeEntityId) {
      return;
    }

    const expandedIds = new Set<string>(getExpandedTranscriptIds(state));
    if (expandedIds.has(transcriptId)) {
      expandedIds.delete(transcriptId);
    } else {
      expandedIds.add(transcriptId);
    }

    dispatch(
      transcriptsSlice.actions.updateExpandedTranscripts({
        activeGenomeId,
        activeEntityId,
        expandedIds: [...expandedIds.values()]
      })
    );
  };

export const toggleTranscriptDownload =
  (transcriptId: string): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const state = getState();
    const activeGenomeId = getEntityViewerActiveGenomeId(state);
    const activeEntityId = getEntityViewerActiveEntityId(state);
    if (!activeGenomeId || !activeEntityId) {
      return;
    }

    const expandedIds = new Set<string>(
      getExpandedTranscriptDownloadIds(state)
    );
    if (expandedIds.has(transcriptId)) {
      expandedIds.delete(transcriptId);
    } else {
      expandedIds.add(transcriptId);
    }

    dispatch(
      transcriptsSlice.actions.updateExpandedDownloads({
        activeGenomeId,
        activeEntityId,
        expandedIds: [...expandedIds.values()]
      })
    );
  };

export const toggleTranscriptMoreInfo =
  (transcriptId: string): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const state = getState();
    const activeGenomeId = getEntityViewerActiveGenomeId(state);
    const activeEntityId = getEntityViewerActiveEntityId(state);
    if (!activeGenomeId || !activeEntityId) {
      return;
    }

    const expandedIds = new Set<string>(
      getExpandedTranscriptMoreInfoIds(state)
    );
    if (expandedIds.has(transcriptId)) {
      expandedIds.delete(transcriptId);
    } else {
      expandedIds.add(transcriptId);
    }
    dispatch(
      transcriptsSlice.actions.updateExpandedMoreInfo({
        activeGenomeId,
        activeEntityId,
        expandedIds: [...expandedIds.values()]
      })
    );
  };

const ensureGenePresence = (
  state: GeneViewTranscriptsState,
  ids: { activeGenomeId: string; activeEntityId: string }
) => {
  const { activeGenomeId, activeEntityId } = ids;
  const clonedDefaultStatePerGene = cloneDeep(defaultStatePerGene);
  if (!state[activeGenomeId]) {
    state[activeGenomeId] = { [activeEntityId]: clonedDefaultStatePerGene };
  } else if (!state[activeGenomeId][activeEntityId]) {
    state[activeGenomeId][activeEntityId] = clonedDefaultStatePerGene;
  }
};

export const restoreGeneViewTranscripts = createAsyncThunk(
  'entity-viewer/restore-gene-view-transcripts',
  () => entityViewerStorageService.getGeneViewTranscriptsState() || {}
);

type ExpandedIdsPayload = {
  activeGenomeId: string;
  activeEntityId: string;
  expandedIds: string[];
};

type UpdateFiltersPayload = {
  activeGenomeId: string;
  activeEntityId: string;
  filters: Filters;
};

type UpdateSortingRulePayload = {
  activeGenomeId: string;
  activeEntityId: string;
  sortingRule: SortingRule;
};

type UpdateFilterPanelPayload = {
  activeGenomeId: string;
  activeEntityId: string;
  filterPanelOpen: boolean;
};

const transcriptsSlice = createSlice({
  name: 'entity-viewer-gene-view-transcripts',
  initialState: {} as GeneViewTranscriptsState,
  reducers: {
    updateExpandedTranscripts(
      state,
      action: PayloadAction<ExpandedIdsPayload>
    ) {
      const { activeGenomeId, activeEntityId, expandedIds } = action.payload;
      ensureGenePresence(state, action.payload);
      state[activeGenomeId][activeEntityId].expandedIds = expandedIds;
      state[activeGenomeId][activeEntityId].isExpandedTranscriptsListModified =
        true;
    },
    updateExpandedDownloads(state, action: PayloadAction<ExpandedIdsPayload>) {
      const { activeGenomeId, activeEntityId, expandedIds } = action.payload;
      ensureGenePresence(state, action.payload);
      state[activeGenomeId][activeEntityId].expandedDownloadIds = expandedIds;
    },
    updateExpandedMoreInfo(state, action: PayloadAction<ExpandedIdsPayload>) {
      const { activeGenomeId, activeEntityId, expandedIds } = action.payload;
      ensureGenePresence(state, action.payload);
      state[activeGenomeId][activeEntityId].expandedMoreInfoIds = expandedIds;
    },
    updateFilterPanel(state, action: PayloadAction<UpdateFilterPanelPayload>) {
      const { activeGenomeId, activeEntityId, filterPanelOpen } =
        action.payload;
      ensureGenePresence(state, action.payload);
      state[activeGenomeId][activeEntityId].filterPanelOpen = filterPanelOpen;
    },
    updateFilters(state, action: PayloadAction<UpdateFiltersPayload>) {
      const { activeGenomeId, activeEntityId, filters } = action.payload;
      ensureGenePresence(state, action.payload);
      state[activeGenomeId][activeEntityId].filters = filters;
    },
    updateSortingRule(state, action: PayloadAction<UpdateSortingRulePayload>) {
      const { activeGenomeId, activeEntityId, sortingRule } = action.payload;
      ensureGenePresence(state, action.payload);
      state[activeGenomeId][activeEntityId].sortingRule = sortingRule;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(restoreGeneViewTranscripts.fulfilled, (state, action) => {
      const storedData = action.payload;

      Object.keys(storedData).forEach((genomeId) => {
        const entitiesPerGenome = storedData[genomeId];
        Object.keys(entitiesPerGenome).forEach((entityId) => {
          ensureGenePresence(state, {
            activeGenomeId: genomeId,
            activeEntityId: entityId
          });

          state[genomeId][entityId] = {
            ...state[genomeId][entityId],
            ...storedData[genomeId][entityId]
          };
        });
      });
    });
  }
});

export const { updateExpandedTranscripts } = transcriptsSlice.actions;

export default transcriptsSlice.reducer;
