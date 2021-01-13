import { RootState } from 'src/store';

export const getAllPreviouslyViewedEntities = (state: RootState) => {
  return state.entityViewer.bookmarks.previouslyViewed;
};

export const getPreviouslyViewedEntities = (state: RootState, genomeId: string) => {
  return getAllPreviouslyViewedEntities(state)[genomeId] || [];
};
