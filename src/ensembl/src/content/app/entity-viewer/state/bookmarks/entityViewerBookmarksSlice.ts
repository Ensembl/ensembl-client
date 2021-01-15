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

type PreviouslyViewedEntity = {
  stable_id: string;
  label: string;
  type: 'gene';
};

type PreviouslyViewedEntites = {
  [genomeId: string]: PreviouslyViewedEntity[];
};

type EntityViewerBookmarksState = {
  previouslyViewed: PreviouslyViewedEntites;
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
    updatePreviouslyViewedEntities(
      state,
      action: PayloadAction<UpdatePreviouslyViewedPayload>
    ) {
      const { genomeId, gene } = action.payload;
      const savedEntitiesWithoutCurrentEntity =
        state.previouslyViewed[genomeId]?.filter(
          (entity) => entity.stable_id !== gene.unversioned_stable_id
        ) || [];
      const newEntity = {
        stable_id: gene.unversioned_stable_id,
        label: gene.symbol || gene.stable_id,
        type: 'gene' as const
      };
      const updatedEntites = [
        newEntity,
        ...savedEntitiesWithoutCurrentEntity
      ].slice(0, 20);
      state.previouslyViewed[genomeId] = updatedEntites;

      // TODO:
      // state here is an Immer object (WritableDraft)
      // entityViewerBookmarksService.savePreviouslyViewedEntites(state); // possibly we'll have to do something to state to make it serializable
      // entityViewerSidebarStorageService.updatePreviouslyViewedObjects({
      //   [activeGenomeId]: limitedPreviouslyViewedObjects
      // });
    }
  }
});

export const { updatePreviouslyViewedEntities } = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
