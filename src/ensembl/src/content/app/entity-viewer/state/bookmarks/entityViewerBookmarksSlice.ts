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
import {
  Filters,
  SortingRule
} from 'ensemblRoot/src/content/app/entity-viewer/state/gene-view/transcripts/geneViewTranscriptsSlice';
import { parseFocusIdFromUrl } from 'ensemblRoot/src/shared/state/ens-object/ensObjectHelpers';
import entityViewerBookmarksStorageService from 'src/content/app/entity-viewer/services/bookmarks/entity-viewer-bookmarks-storage-service';

type PreviouslyViewedEntity = {
  entity_id: string;
  label: string[];
  type: 'gene';
  filters: Filters;
  sortingRule: SortingRule;
};

export type PreviouslyViewedEntities = {
  [genomeId: string]: PreviouslyViewedEntity[];
};

type EntityViewerBookmarksState = {
  previouslyViewed: PreviouslyViewedEntities;
};

type UpdatePreviouslyViewedPayload = {
  genomeId: string;
  gene: {
    symbol: string | null;
    stable_id: string;
    unversioned_stable_id: string;
  };
};

const initialState: EntityViewerBookmarksState = {
  previouslyViewed: {}
};

const bookmarksSlice = createSlice({
  name: 'entity-viewer-bookmarks',
  initialState,
  reducers: {
    loadPreviouslyViewedEntities(state) {
      state.previouslyViewed =
        entityViewerBookmarksStorageService.getPreviouslyViewedEntities();
    },
    updatePreviouslyViewedEntities(
      state,
      action: PayloadAction<UpdatePreviouslyViewedPayload>
    ) {
      const { genomeId, gene } = action.payload;
      const previouslySavedCurrentEntity = state.previouslyViewed[
        genomeId
      ]?.find((entity) => entity.entity_id === gene.unversioned_stable_id);

      const savedEntitiesWithoutCurrentEntity =
        state.previouslyViewed[genomeId]?.filter(
          (entity) => entity.entity_id !== gene.unversioned_stable_id
        ) || [];

      const newEntity = {
        entity_id: gene.unversioned_stable_id,
        label: gene.symbol ? [gene.symbol, gene.stable_id] : [gene.stable_id],
        type: 'gene' as const,
        filters: previouslySavedCurrentEntity?.filters || {},
        sortingRule:
          previouslySavedCurrentEntity?.sortingRule || SortingRule.DEFAULT
      };
      const updatedEntites = [
        newEntity,
        ...savedEntitiesWithoutCurrentEntity
      ].slice(0, 20);
      state.previouslyViewed[genomeId] = updatedEntites;

      entityViewerBookmarksStorageService.updatePreviouslyViewedEntities({
        [genomeId]: updatedEntites
      });
    },

    updatePreviouslyViewedEntitiyFilters(
      state,
      action: PayloadAction<{
        genomeId: string;
        entityId: string;
        filters: Filters;
      }>
    ) {
      const { genomeId, entityId } = action.payload;

      const unversionedStableId = parseFocusIdFromUrl(entityId).objectId;

      const previouslySavedCurrentEntityIndex = state.previouslyViewed[
        genomeId
      ]?.findIndex((entity) => entity.entity_id === unversionedStableId);

      const updatedEntites = [...state.previouslyViewed[genomeId]];
      updatedEntites[previouslySavedCurrentEntityIndex].filters =
        action.payload.filters;

      state.previouslyViewed[genomeId] = updatedEntites;

      entityViewerBookmarksStorageService.updatePreviouslyViewedEntities({
        [genomeId]: updatedEntites
      });
    },

    updatePreviouslyViewedEntitiySorting(
      state,
      action: PayloadAction<{
        genomeId: string;
        entityId: string;
        sortingRule: SortingRule;
      }>
    ) {
      const { genomeId, entityId } = action.payload;
      const unversionedStableId = parseFocusIdFromUrl(entityId).objectId;

      const previouslySavedCurrentEntityIndex = state.previouslyViewed[
        genomeId
      ]?.findIndex((entity) => entity.entity_id === unversionedStableId);

      const updatedEntites = [...state.previouslyViewed[genomeId]];
      updatedEntites[previouslySavedCurrentEntityIndex].sortingRule =
        action.payload.sortingRule;

      state.previouslyViewed[genomeId] = updatedEntites;

      entityViewerBookmarksStorageService.updatePreviouslyViewedEntities({
        [genomeId]: updatedEntites
      });
    }
  }
});

export const {
  updatePreviouslyViewedEntities,
  updatePreviouslyViewedEntitiySorting,
  updatePreviouslyViewedEntitiyFilters,
  loadPreviouslyViewedEntities
} = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
