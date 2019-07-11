import { RootState } from 'src/store';

export const getFiltersAccordionExpandedPanel = (state: RootState): string =>
  state.customDownload.filtersAccordion.expandedPanel;

export const getFilters = (state: RootState): {} =>
  state.customDownload.filtersAccordion.filters;

export const getSelectedFilters = (state: RootState): {} =>
  state.customDownload.filtersAccordion.selectedFilters;

export const getContentState = (state: RootState): {} =>
  state.customDownload.filtersAccordion.contentState;
