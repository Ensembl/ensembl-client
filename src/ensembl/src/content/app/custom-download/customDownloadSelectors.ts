import { RootState } from 'src/store';

export const getSelectedPreFilter = (state: RootState): string =>
  state.customDownload.selectedPreFilter;

export const getShowPreFilterPanel = (state: RootState): boolean =>
  state.customDownload.showPreFiltersPanel;

export const getSelectedTabButton = (state: RootState): string =>
  state.customDownload.selectedTabButton;

export const getAttributes = (state: RootState): {} =>
  state.customDownload.attributesAccordion.attributes;

export const getGeneAttributes = (state: RootState): {} =>
  state.customDownload.attributesAccordion.attributes.gene;

export const getTranscriptAttributes = (state: RootState): {} =>
  state.customDownload.attributesAccordion.attributes.transcripts;

export const getOrthologueAttributes = (state: RootState): {} =>
  state.customDownload.attributesAccordion.attributes.orthologues;

export const getOrthologueSearchTerm = (state: RootState): string =>
  state.customDownload.attributesAccordion.orthologue.searchTerm;

export const getOrthologueShowBestMatches = (state: RootState): boolean =>
  state.customDownload.attributesAccordion.orthologue.showBestMatches;

export const getOrthologueShowAll = (state: RootState): boolean =>
  state.customDownload.attributesAccordion.orthologue.showAll;

export const getOrthologueSpecies = (state: RootState): [] =>
  state.customDownload.attributesAccordion.orthologue.species;

export const getOrthologueFilteredSpecies = (state: RootState): {} =>
  state.customDownload.attributesAccordion.orthologue.filteredSpecies;

export const getLocationAttributes = (state: RootState): {} =>
  state.customDownload.attributesAccordion.attributes.location;

export const getGermlineVariationAttributes = (state: RootState): {} =>
  state.customDownload.attributesAccordion.attributes.germline_variation;

export const getSomaticVariationAttributes = (state: RootState): {} =>
  state.customDownload.attributesAccordion.attributes.somatic_variation;

export const getAttributesAccordionExpandedPanel = (state: RootState): string =>
  state.customDownload.attributesAccordion.expandedPanel;

export const getVariationAccordionExpandedPanels = (state: RootState): [] =>
  state.customDownload.attributesAccordion.expandedVariationPanels;

export const getFiltersAccordionExpandedPanel = (state: RootState): string =>
  state.customDownload.filtersAccordion.expandedPanel;

export const getFiltersAccordionExpandedGenePanels = (state: RootState): [] =>
  state.customDownload.filtersAccordion.expandedGenePanels;

export const getFilters = (state: RootState): {} =>
  state.customDownload.filters;

export const getGeneFilters = (state: RootState): string =>
  state.customDownload.filters.gene;

export const getGeneTypeFilters = (state: RootState): string =>
  state.customDownload.filters.gene_type;

export const getTranscriptTypeFilters = (state: RootState): string =>
  state.customDownload.filters.biotype;

export const getPreviewResult = (state: RootState): string =>
  state.customDownload.previewResult;

export const getIsLoadingResult = (state: RootState): boolean =>
  state.customDownload.isLoadingResult;
