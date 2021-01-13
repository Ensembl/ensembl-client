import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type PreviouslyViewedEntity = {
  stable_id: string;
  label: string;
  type: 'gene';
};

type PreviouslyViewedEntites = {
  [genomeId: string]: PreviouslyViewedEntity[]
};

type EntityViewerBookmarksState = {
  previouslyViewed: PreviouslyViewedEntites
};

type UpdatePreviouslyViewedPayload = {
  genomeId: string;
  gene: {
    symbol: string | null;
    stable_id: string;
    unversioned_stable_id: string;
  }
};

const initialState: EntityViewerBookmarksState = {
  previouslyViewed: {}
};

const bookmarksSlice = createSlice({
  name: 'entity-viewer-bookmarks',
  initialState,
  reducers: {
    updatePreviouslyViewedEntities(state, action: PayloadAction<UpdatePreviouslyViewedPayload>) {
      const { genomeId, gene } = action.payload;
      const savedEntitiesWithoutCurrentEntity = state
        .previouslyViewed[genomeId]
        ?.filter(entity => entity.stable_id !== gene.unversioned_stable_id) || [];
      const newEntity = {
        stable_id: gene.unversioned_stable_id,
        label: gene.symbol || gene.stable_id,
        type: 'gene' as const
      };
      const updatedEntites = [newEntity, ...savedEntitiesWithoutCurrentEntity].slice(0, 20);
      state.previouslyViewed[genomeId] = updatedEntites;

      // TODO:
      // state here is an Immer object (WritableDraft)
      // entityViewerBookmarksService.savePreviouslyViewedEntites(state); // possibly we'll have to do something to state to make it serializable
    }
  }
});

export const { updatePreviouslyViewedEntities } = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
