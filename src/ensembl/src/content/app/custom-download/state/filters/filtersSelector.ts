import { RootState } from 'src/store';
import { getCustomDownloadActiveGenomeConfiguration } from '../customDownloadSelectors';

export const getFiltersAccordionExpandedPanels = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).filters.expandedPanels ||
  [];

export const getFilters = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).filters.filters;

export const getSelectedFilters = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).filters.selectedFilters;

export const getFiltersUi = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).filters.ui;
