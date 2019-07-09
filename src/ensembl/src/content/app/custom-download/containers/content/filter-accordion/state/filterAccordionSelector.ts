import { RootState } from 'src/store';

export const getFiltersAccordionExpandedPanel = (state: RootState): string =>
  state.customDownload.filtersAccordion.expandedPanel;

export const getFiltersAccordionExpandedGenePanels = (
  state: RootState
): string[] => state.customDownload.filtersAccordion.expandedGenePanels;

export const getFilters = (state: RootState): {} =>
  state.customDownload.filtersAccordion.filters;

export const getSelectedFilters = (state: RootState): {} =>
  state.customDownload.filtersAccordion.selectedFilters;

export const getGeneFilters = (state: RootState): string =>
  state.customDownload.filtersAccordion.filters.gene;

export const getGeneSourceFilters = (state: RootState): {} =>
  state.customDownload.filtersAccordion.filters.source;

export const getGencodeAnnotationFilters = (state: RootState): string =>
  state.customDownload.filtersAccordion.filters.gencode_basic_annotation;

export const getGeneTypeFilters = (state: RootState): string =>
  state.customDownload.filtersAccordion.filters.gene_type;

export const getTranscriptTypeFilters = (state: RootState): string =>
  state.customDownload.filtersAccordion.filters.biotype;
