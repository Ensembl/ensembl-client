import { RootState } from 'src/store';

export const getFiltersAccordionExpandedPanel = (state: RootState) =>
  state.customDownload.filters.expandedPanel;

export const getFilters = (state: RootState) =>
  state.customDownload.filters.filters;

export const getSelectedFilters = (state: RootState) =>
  state.customDownload.filters.selectedFilters;

export const getFiltersUi = (state: RootState) =>
  state.customDownload.filters.ui;
