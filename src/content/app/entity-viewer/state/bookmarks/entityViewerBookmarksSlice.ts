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
import merge from 'lodash/merge';

import { getPreviouslyViewedEntities } from './entityViewerBookmarksSelectors';

import entityViewerBookmarksStorageService from 'src/content/app/entity-viewer/services/bookmarks/entity-viewer-bookmarks-storage-service';
import entityViewerStorageService from 'src/content/app/entity-viewer/services/entity-viewer-storage-service';

import { RootState } from 'src/store';

type PreviouslyViewedEntity = {
  entity_id: string;
  label: string | string[];
  type: 'gene';
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

export const updatePreviouslyViewedEntities = createAsyncThunk(
  'entity-viewer/updatePreviouslyViewedEntities',
  (params: UpdatePreviouslyViewedPayload, thunkAPI) => {
    const { genomeId, gene } = params;
    const { getState } = thunkAPI;
    const state = getState() as RootState;

    const previouslyViewedEntities = getPreviouslyViewedEntities(
      state,
      genomeId
    );

    const alreadySavedGene = previouslyViewedEntities.find(
      (entity) => entity.entity_id === gene.unversioned_stable_id
    );

    const newPreviouslyViewedEntity = {
      entity_id: gene.unversioned_stable_id,
      label: gene.symbol ? [gene.symbol, gene.stable_id] : gene.stable_id,
      type: 'gene' as const
    };

    const updatedEntities = alreadySavedGene
      ? previouslyViewedEntities
      : [newPreviouslyViewedEntity, ...previouslyViewedEntities];

    // side effect
    entityViewerBookmarksStorageService.updatePreviouslyViewedEntities({
      [genomeId]: updatedEntities
    });

    return {
      genomeId,
      updatedEntities
    };
  }
);

export const updatePreviouslyViewedEntity = createAsyncThunk(
  'entity-viewer/updatePreviouslyViewedEntity',
  (
    params: {
      genomeId: string;
      previouslyViewedEntityId: string;
      fragment: Partial<PreviouslyViewedEntity>;
    },
    thunkAPI
  ) => {
    const { genomeId, previouslyViewedEntityId, fragment } = params;
    const state = thunkAPI.getState() as RootState;
    const updatedEntities = getPreviouslyViewedEntities(state, genomeId).map(
      (entity) => {
        if (entity.entity_id === previouslyViewedEntityId) {
          return merge({}, entity, fragment);
        }
        return entity;
      }
    );

    // side effect
    entityViewerBookmarksStorageService.updatePreviouslyViewedEntities({
      [genomeId]: updatedEntities
    });

    return {
      genomeId,
      updatedEntities
    };
  }
);

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

      const previouslyViewedEntities = state.previouslyViewed[genomeId] || [];

      const isCurrentEntityPreviouslyViewed = previouslyViewedEntities?.some(
        (entity) => entity.entity_id === gene.unversioned_stable_id
      );

      if (!isCurrentEntityPreviouslyViewed) {
        const newEntity = {
          entity_id: gene.unversioned_stable_id,
          label: gene.symbol ? [gene.symbol, gene.stable_id] : gene.stable_id,
          type: 'gene' as const
        };

        // clear the stored data for the oldest previously viewed entity
        if (previouslyViewedEntities.length === 20) {
          const oldestPreviouslyViewedEntity =
            previouslyViewedEntities[previouslyViewedEntities.length - 1];

          entityViewerStorageService.clearGeneViewTranscriptsState({
            genomeId,
            entityId: oldestPreviouslyViewedEntity.entity_id
          });
        }

        const updatedEntites = [newEntity, ...previouslyViewedEntities].slice(
          0,
          21
        );
        state.previouslyViewed[genomeId] = updatedEntites;

        entityViewerBookmarksStorageService.updatePreviouslyViewedEntities({
          [genomeId]: updatedEntites
        });
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      updatePreviouslyViewedEntities.fulfilled,
      (state, action) => {
        const { genomeId, updatedEntities } = action.payload;
        state.previouslyViewed[genomeId] = updatedEntities;
      }
    ),
      builder.addCase(
        updatePreviouslyViewedEntity.fulfilled,
        (state, action) => {
          const { genomeId, updatedEntities } = action.payload;
          state.previouslyViewed[genomeId] = updatedEntities;
        }
      );
  }
});

export const { loadPreviouslyViewedEntities } = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
