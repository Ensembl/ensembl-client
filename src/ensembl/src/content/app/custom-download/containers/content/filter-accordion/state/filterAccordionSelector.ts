import { RootState } from 'src/store';

export const getFiltersAccordionExpandedPanel = (state: RootState): string =>
  state.customDownload.filters.expandedPanel;

export const getFilters = (state: RootState): {} =>
  state.customDownload.filters.filters;

export const getSelectedFilters = (state: RootState): {} =>
  state.customDownload.filters.selectedFilters;

export const getContentState = (state: RootState): {} =>
  state.customDownload.filters.contentState;
