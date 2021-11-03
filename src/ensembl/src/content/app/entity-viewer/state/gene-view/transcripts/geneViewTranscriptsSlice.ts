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

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import cloneDeep from 'lodash/cloneDeep';

import {
  buildEnsObjectId,
  parseEnsObjectId
} from 'src/shared/state/ens-object/ensObjectHelpers';

import entityViewerBookmarksStorageService from 'src/content/app/entity-viewer/services/bookmarks/entity-viewer-bookmarks-storage-service';
import { getPreviouslyViewedEntities } from 'src/content/app/entity-viewer/state/bookmarks/entityViewerBookmarksSelectors';
import { updatePreviouslyViewedEntity } from 'src/content/app/entity-viewer/state/bookmarks/entityViewerBookmarksSlice';

import {
  getEntityViewerActiveGenomeId,
  getEntityViewerActiveEntityId
} from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSelectors';

import { TranscriptMetadata } from 'src/shared/types/thoas/metadata';

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
  filterPanelOpen: boolean;
};

export type GeneViewTranscriptsState = {
  [genomeId: string]: {
    [geneId: string]: TranscriptsStatePerGene;
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
  expandedDownloadIds: [],
  expandedMoreInfoIds: [],
  filters: {},
  sortingRule: SortingRule.DEFAULT,
  filterPanelOpen: false
};

export const resetFilterPanel =
  (): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
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
  (filterPanelOpen: boolean): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
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

    dispatch(
      storeFiltersAndSortingRules({
        genomeId: activeGenomeId,
        entityId: activeEntityId,
        fragment: { filters }
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

    dispatch(
      storeFiltersAndSortingRules({
        genomeId: activeGenomeId,
        entityId: activeEntityId,
        fragment: { sortingRule }
      })
    );
  };

const storeFiltersAndSortingRules =
  (params: {
    genomeId: string;
    entityId: string;
    fragment: {
      filters?: Filters;
      sortingRule?: SortingRule;
    };
  }): ThunkAction<void, any, null, Action<string>> =>
  (dispatch, getState: () => RootState) => {
    const { genomeId, entityId, fragment } = params;
    const state = getState();
    const geneStableId = parseEnsObjectId(entityId).objectId;
    const storedGene = getPreviouslyViewedEntities(state, genomeId).find(
      (entity) => entity.entity_id === geneStableId
    );
    if (!storedGene) {
      return;
    }

    dispatch(
      updatePreviouslyViewedEntity({
        genomeId,
        previouslyViewedEntityId: geneStableId,
        fragment
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

export const restoreTranscriptsFiltersAndSorting = createAsyncThunk(
  'entity-viewer-gene-view-transcripts/restoreFiltersAndSorting',
  () => {
    return entityViewerBookmarksStorageService.getPreviouslyViewedEntities();
  }
);

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
    builder.addCase(
      restoreTranscriptsFiltersAndSorting.fulfilled,
      (state, action) => {
        const restoredEntities = action.payload;
        Object.keys(restoredEntities).forEach((genomeId) => {
          const entitiesPerGenome = restoredEntities[genomeId];
          entitiesPerGenome.forEach((entity) => {
            const entityId = buildEnsObjectId({
              genomeId,
              type: entity.type,
              objectId: entity.entity_id
            });
            ensureGenePresence(state, {
              activeGenomeId: genomeId,
              activeEntityId: entityId
            });
            if (entity.filters) {
              state[genomeId][entityId].filters = entity.filters;
            }
            if (entity.sortingRule) {
              state[genomeId][entityId].sortingRule = entity.sortingRule;
            }
          });
        });
      }
    );
  }
});

export const { updateExpandedTranscripts } = transcriptsSlice.actions;

export default transcriptsSlice.reducer;
