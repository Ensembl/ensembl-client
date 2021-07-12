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
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import set from 'lodash/fp/set';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEntityId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';

import {
  getExpandedTranscriptIds,
  getExpandedTranscriptDownloadIds,
  getExpandedTranscriptMoreInfoIds
} from './geneViewTranscriptsSelectors';

import { RootState } from 'src/store';

export enum SortingRule {
  DEFAULT = 'default',
  SPLICED_LENGTH_DESC = 'spliced_length_desc',
  SPLICED_LENGTH_ASC = 'spliced_length_asc',
  EXON_COUNT_DESC = 'exon_count_desc',
  EXON_COUNT_ASC = 'exon_count_asc'
}

export type TranscriptsStatePerGene = {
  expandedIds: string[];
  expandedDownloadIds: string[];
  expandedMoreInfoIds: string[];
  filters: Filters;
  sortingRule: SortingRule;
};

export type GeneViewTranscriptsState = {
  [genomeId: string]: {
    [geneId: string]: TranscriptsStatePerGene;
  };
};

export type Filters = { [filter: string]: boolean };

const defaultStatePerGene: TranscriptsStatePerGene = {
  expandedIds: [],
  expandedDownloadIds: [],
  expandedMoreInfoIds: [],
  filters: {},
  sortingRule: SortingRule.DEFAULT
};

export const setFilters =
  (filters: Filters): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
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
  };

export const setSortingRule =
  (sortingRule: SortingRule): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
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
  };

export const toggleTranscriptInfo =
  (transcriptId: string): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
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
  (transcriptId: string): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
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
  (transcriptId: string): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
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
  if (!state[activeGenomeId]) {
    return set(
      activeGenomeId,
      { [activeEntityId]: defaultStatePerGene },
      state
    );
  } else if (!state[activeGenomeId][activeEntityId]) {
    return set(
      `${activeGenomeId}.${activeEntityId}`,
      defaultStatePerGene,
      state
    );
  } else {
    return state;
  }
};

type ExpandedIdsPayload = {
  activeGenomeId: string;
  activeEntityId: string;
  expandedIds: string[];
};

type UpdateFiltersPayload = {
  activeGenomeId: string;
  activeEntityId: string;
  filters: {
    [filter: string]: boolean;
  };
};

type UpdateSortingRulePayload = {
  activeGenomeId: string;
  activeEntityId: string;
  sortingRule: SortingRule;
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
      const updatedState = ensureGenePresence(state, action.payload);
      return set(
        `${activeGenomeId}.${activeEntityId}.expandedIds`,
        expandedIds,
        updatedState
      );
    },
    updateExpandedDownloads(state, action: PayloadAction<ExpandedIdsPayload>) {
      const { activeGenomeId, activeEntityId, expandedIds } = action.payload;
      const updatedState = ensureGenePresence(state, action.payload);
      return set(
        `${activeGenomeId}.${activeEntityId}.expandedDownloadIds`,
        expandedIds,
        updatedState
      );
    },
    updateExpandedMoreInfo(state, action: PayloadAction<ExpandedIdsPayload>) {
      const { activeGenomeId, activeEntityId, expandedIds } = action.payload;
      const updatedState = ensureGenePresence(state, action.payload);
      return set(
        `${activeGenomeId}.${activeEntityId}.expandedMoreInfoIds`,
        expandedIds,
        updatedState
      );
    },
    updateFilters(state, action: PayloadAction<UpdateFiltersPayload>) {
      const { activeGenomeId, activeEntityId, filters } = action.payload;
      const updatedState = ensureGenePresence(state, action.payload);
      return set(
        `${activeGenomeId}.${activeEntityId}.filters`,
        filters,
        updatedState
      );
    },
    updateSortingRule(state, action: PayloadAction<UpdateSortingRulePayload>) {
      const { activeGenomeId, activeEntityId, sortingRule } = action.payload;
      const updatedState = ensureGenePresence(state, action.payload);
      return set(
        `${activeGenomeId}.${activeEntityId}.sortingRule`,
        sortingRule,
        updatedState
      );
    }
  }
});

export default transcriptsSlice.reducer;
