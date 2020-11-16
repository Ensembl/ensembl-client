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
  getEntityViewerActiveEnsObjectId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';

import {
  getExpandedTranscriptIds,
  getExpandedTranscriptDownloadIds
} from './geneViewTranscriptsSelectors';

import { RootState } from 'src/store';

export enum SortingRule {
  DEFAULT = 'default',
  SPLICED_LENGTH_LONGEST_TO_SHORTEST = 'spliced_length_longest_to_shortest',
  SPLICED_LENGTH_SHORTEST_TO_LONGEST = 'spliced_length_shortest_to_longest'
}

export type TranscriptsStatePerGene = {
  expandedIds: string[];
  expandedDownloadIds: string[];
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
  filters: {},
  sortingRule: SortingRule.DEFAULT
};

export const setFilters = (
  filters: Filters
): ThunkAction<void, any, null, Action<string>> => (
  dispatch,
  getState: () => RootState
) => {
  const state = getState();
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  const activeObjectId = getEntityViewerActiveEnsObjectId(state);
  if (!activeGenomeId || !activeObjectId) {
    return;
  }
  dispatch(
    transcriptsSlice.actions.updateFilters({
      activeGenomeId,
      activeObjectId,
      filters
    })
  );
};

export const setSortingRule = (
  sortingRule: SortingRule
): ThunkAction<void, any, null, Action<string>> => (
  dispatch,
  getState: () => RootState
) => {
  const state = getState();
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  const activeObjectId = getEntityViewerActiveEnsObjectId(state);
  if (!activeGenomeId || !activeObjectId) {
    return;
  }

  dispatch(
    transcriptsSlice.actions.updateSortingRule({
      activeGenomeId,
      activeObjectId,
      sortingRule
    })
  );
};

export const toggleTranscriptInfo = (
  transcriptId: string
): ThunkAction<void, any, null, Action<string>> => (
  dispatch,
  getState: () => RootState
) => {
  const state = getState();
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  const activeObjectId = getEntityViewerActiveEnsObjectId(state);
  if (!activeGenomeId || !activeObjectId) {
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
      activeObjectId,
      expandedIds: [...expandedIds.values()]
    })
  );
};

export const toggleTranscriptDownload = (
  transcriptId: string
): ThunkAction<void, any, null, Action<string>> => (
  dispatch,
  getState: () => RootState
) => {
  const state = getState();
  const activeGenomeId = getEntityViewerActiveGenomeId(state);
  const activeObjectId = getEntityViewerActiveEnsObjectId(state);
  if (!activeGenomeId || !activeObjectId) {
    return;
  }

  const expandedIds = new Set<string>(getExpandedTranscriptDownloadIds(state));
  if (expandedIds.has(transcriptId)) {
    expandedIds.delete(transcriptId);
  } else {
    expandedIds.add(transcriptId);
  }

  dispatch(
    transcriptsSlice.actions.updateExpandedDownloads({
      activeGenomeId,
      activeObjectId,
      expandedIds: [...expandedIds.values()]
    })
  );
};

const ensureGenePresence = (
  state: GeneViewTranscriptsState,
  ids: { activeGenomeId: string; activeObjectId: string }
) => {
  const { activeGenomeId, activeObjectId } = ids;
  if (!state[activeGenomeId]) {
    return set(
      activeGenomeId,
      { [activeObjectId]: defaultStatePerGene },
      state
    );
  } else if (!state[activeGenomeId][activeObjectId]) {
    return set(
      `${activeGenomeId}.${activeObjectId}`,
      defaultStatePerGene,
      state
    );
  } else {
    return state;
  }
};

type ExpandedIdsPayload = {
  activeGenomeId: string;
  activeObjectId: string;
  expandedIds: string[];
};

type UpdateFiltersPayload = {
  activeGenomeId: string;
  activeObjectId: string;
  filters: {
    [filter: string]: boolean;
  };
};

type UpdateSortingRulePayload = {
  activeGenomeId: string;
  activeObjectId: string;
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
      const { activeGenomeId, activeObjectId, expandedIds } = action.payload;
      const updatedState = ensureGenePresence(state, action.payload);
      return set(
        `${activeGenomeId}.${activeObjectId}.expandedIds`,
        expandedIds,
        updatedState
      );
    },
    updateExpandedDownloads(state, action: PayloadAction<ExpandedIdsPayload>) {
      const { activeGenomeId, activeObjectId, expandedIds } = action.payload;
      const updatedState = ensureGenePresence(state, action.payload);
      return set(
        `${activeGenomeId}.${activeObjectId}.expandedDownloadIds`,
        expandedIds,
        updatedState
      );
    },
    updateFilters(state, action: PayloadAction<UpdateFiltersPayload>) {
      const { activeGenomeId, activeObjectId, filters } = action.payload;
      const updatedState = ensureGenePresence(state, action.payload);
      return set(
        `${activeGenomeId}.${activeObjectId}.filters`,
        filters,
        updatedState
      );
    },
    updateSortingRule(state, action: PayloadAction<UpdateSortingRulePayload>) {
      const { activeGenomeId, activeObjectId, sortingRule } = action.payload;
      const updatedState = ensureGenePresence(state, action.payload);
      return set(
        `${activeGenomeId}.${activeObjectId}.sortingRule`,
        sortingRule,
        updatedState
      );
    }
  }
});

export default transcriptsSlice.reducer;
