import { RootState } from 'src/store';

export const getActiveComponentId = (state: RootState) =>
  state.helpAndDocs.activeComponentId;

export const isPopupShown = (state: RootState) =>
  state.helpAndDocs.isPopupShown;

// FIXME: This function will not be required if we use GraphQL
export const getFetchedArticles = (state: RootState) =>
  state.helpAndDocs.fetchedArticles;

// FIXME: This function will not be required if we use GraphQL
export const getActiveComponentHelpContent = (state: RootState) => {
  const activeComponentId = getActiveComponentId(state);

  if (!activeComponentId) {
    return null;
  }

  return getFetchedArticles(state)[activeComponentId] || null;
};
