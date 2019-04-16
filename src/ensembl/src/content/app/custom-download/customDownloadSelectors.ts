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
  state.customDownload.contentPanel.attributes.transcript;

export const getGermlineVariationAttributes = (state: RootState): {} =>
  state.customDownload.contentPanel.attributes.germline_variation;

export const getSomaticVariationAttributes = (state: RootState): {} =>
  state.customDownload.contentPanel.attributes.somatic_variation;

export const getAttributesAccordionExpandedPanel = (state: RootState): string =>
  state.customDownload.contentPanel.attributesAccordion.expandedPanel;

export const getVariationAccordionExpandedPanels = (state: RootState): [] =>
  state.customDownload.contentPanel.attributesAccordion.expandedVariationPanels;
