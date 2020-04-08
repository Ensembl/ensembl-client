import { RootState } from 'src/store';

export const getActiveComponentId = (state: RootState) =>
  state.helpAndDocs.activeComponentId;

export const isPopupShown = (state: RootState) =>
  state.helpAndDocs.isPopupShown;

export const getFetchedContents = (state: RootState) =>
  state.helpAndDocs.fetchedContents;

export const getActiveComponentHelpContent = (state: RootState) => {
  const activeComponentId = getActiveComponentId(state);

  if (!activeComponentId) {
    return null;
  }

  return getFetchedContents(state)[activeComponentId] || null;
};
