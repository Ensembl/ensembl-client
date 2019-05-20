import { RootState } from 'src/store';

export const getFiltersAccordionExpandedPanel = (state: RootState): string =>
  state.customDownload.filtersAccordion.expandedPanel;

export const getFiltersAccordionExpandedGenePanels = (state: RootState): [] =>
  state.customDownload.filtersAccordion.expandedGenePanels;

export const getFilters = (state: RootState): {} =>
  state.customDownload.filtersAccordion.filters;

export const getGeneFilters = (state: RootState): string =>
  state.customDownload.filtersAccordion.filters.gene;

export const getGeneSourceFilters = (state: RootState): {} =>
  state.customDownload.filtersAccordion.filters.gene_source;

export const getGeneTypeFilters = (state: RootState): string =>
  state.customDownload.filtersAccordion.filters.gene_type;

export const getTranscriptTypeFilters = (state: RootState): string =>
  state.customDownload.filtersAccordion.filters.biotype;
