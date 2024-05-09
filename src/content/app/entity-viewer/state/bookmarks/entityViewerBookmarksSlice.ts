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

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import entityViewerStorageService from 'src/content/app/entity-viewer/services/entity-viewer-storage-service';
import {
  savePreviouslyViewedEntities,
  getAllPreviouslyViewedEntities
} from 'src/shared/services/previouslyViewedObjectsStorageService';

import { getPreviouslyViewedEntities } from './entityViewerBookmarksSelectors';

import { RootState } from 'src/store';

export type PreviouslyViewedEntity = {
  id: string;
  urlId: string; // e.g. for genes, this is unversioned stable id rather than stable id
  label: string | string[];
  type: 'gene' | 'variant';
};

export type PreviouslyViewedEntities = {
  [genomeId: string]: PreviouslyViewedEntity[];
};

type EntityViewerBookmarksState = {
  previouslyViewed: PreviouslyViewedEntities;
};

type UpdatePreviouslyViewedPayload = {
  genomeId: string;
  entity: PreviouslyViewedEntity;
};

export const updatePreviouslyViewedEntities = createAsyncThunk(
  'entity-viewer/updatePreviouslyViewedEntities',
  (params: UpdatePreviouslyViewedPayload, thunkAPI) => {
    const { genomeId, entity } = params;
    const { getState } = thunkAPI;
    const state = getState() as RootState;

    const previouslyViewedEntities = getPreviouslyViewedEntities(
      state,
      genomeId
    );

    const isCurrentEntityPreviouslyViewed = previouslyViewedEntities?.some(
      (previouslyViewedEntity) => previouslyViewedEntity.id === entity.id
    );

    if (isCurrentEntityPreviouslyViewed) {
      return {
        genomeId,
        updatedEntities: previouslyViewedEntities
      };
    }

    // clear the stored data for the oldest previously viewed entity
    if (previouslyViewedEntities.length === 20) {
      const oldestPreviouslyViewedEntity =
        previouslyViewedEntities[previouslyViewedEntities.length - 1];

      entityViewerStorageService.clearGeneViewTranscriptsState({
        genomeId,
        entityId: oldestPreviouslyViewedEntity.id
      });
    }

    const newPreviouslyViewedEntity: PreviouslyViewedEntity = {
      id: entity.id,
      urlId: entity.urlId,
      label: entity.label,
      type: entity.type
    };

    const updatedEntities = [
      newPreviouslyViewedEntity,
      ...previouslyViewedEntities
    ].slice(0, 20);

    // side effect
    savePreviouslyViewedEntities(genomeId, updatedEntities);

    return {
      genomeId,
      updatedEntities
    };
  }
);

export const loadPreviouslyViewedEntities = createAsyncThunk(
  'entity-viewer/loadPreviouslyViewedEntities',
  () => getAllPreviouslyViewedEntities()
);

const initialState: EntityViewerBookmarksState = {
  previouslyViewed: {}
};

const bookmarksSlice = createSlice({
  name: 'entity-viewer-bookmarks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      updatePreviouslyViewedEntities.fulfilled,
      (state, action) => {
        const { genomeId, updatedEntities } = action.payload;
        state.previouslyViewed[genomeId] = updatedEntities;
      }
    );

    builder.addCase(loadPreviouslyViewedEntities.fulfilled, (state, action) => {
      state.previouslyViewed = action.payload;
    });
  }
});

export default bookmarksSlice.reducer;
