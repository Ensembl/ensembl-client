import { RootState } from 'src/store';

export const getSelectedPreFilter = (state: RootState): string =>
  state.customDownload.preFilterPanel.selectedPreFilter;

export const getShowPreFilterPanel = (state: RootState): boolean =>
  state.customDownload.preFilterPanel.showPreFiltersPanel;

export const getSelectedTabButton = (state: RootState): string =>
  state.customDownload.contentPanel.selectedTabButton;

export const getAttributes = (state: RootState): {} =>
  state.customDownload.contentPanel.attributes;

export const getGeneAttributes = (state: RootState): {} =>
  state.customDownload.contentPanel.attributes.gene;

export const getTranscriptAttributes = (state: RootState): {} =>
  state.customDownload.contentPanel.attributes.transcripts;

export const getLocationAttributes = (state: RootState): {} =>
  state.customDownload.contentPanel.attributes.location;

export const getGermlineVariationAttributes = (state: RootState): {} =>
  state.customDownload.contentPanel.attributes.germline_variation;

export const getSomaticVariationAttributes = (state: RootState): {} =>
  state.customDownload.contentPanel.attributes.somatic_variation;

export const getAttributesAccordionExpandedPanel = (state: RootState): string =>
  state.customDownload.contentPanel.attributesAccordion.expandedPanel;

export const getVariationAccordionExpandedPanels = (state: RootState): [] =>
  state.customDownload.contentPanel.attributesAccordion.expandedVariationPanels;

export const getFiltersAccordionExpandedPanel = (state: RootState): string =>
  state.customDownload.contentPanel.filtersAccordion.expandedPanel;

export const getFiltersAccordionExpandedGenePanels = (state: RootState): [] =>
  state.customDownload.contentPanel.filtersAccordion.expandedGenePanels;

export const getFilters = (state: RootState): {} =>
  state.customDownload.contentPanel.filters;

export const getGeneFilters = (state: RootState): string =>
  state.customDownload.contentPanel.filters.gene;

export const getGeneTypeFilters = (state: RootState): string =>
  state.customDownload.contentPanel.filters.gene_type;

export const getTranscriptTypeFilters = (state: RootState): string =>
  state.customDownload.contentPanel.filters.biotype;

export const getPreviewResult = (state: RootState): string =>
  state.customDownload.contentPanel.previewResult;

export const getIsLoadingResult = (state: RootState): boolean =>
  state.customDownload.contentPanel.isLoadingResult;
