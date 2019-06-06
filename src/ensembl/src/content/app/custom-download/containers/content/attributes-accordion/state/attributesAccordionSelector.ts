import { RootState } from 'src/store';

export const getAttributes = (state: RootState): {} =>
  state.customDownload.attributesAccordion.attributes;

export const getGeneAttributes = (state: RootState): {} =>
  state.customDownload.attributesAccordion.attributes.gene;

export const getTranscriptAttributes = (state: RootState): {} =>
  state.customDownload.attributesAccordion.attributes.transcripts;

export const getPhenotypeAttributes = (state: RootState): {} =>
  state.customDownload.attributesAccordion.attributes.phenotypes;

export const getOrthologueAttributes = (state: RootState): {} =>
  state.customDownload.attributesAccordion.attributes.orthologues;

export const getOrthologueSearchTerm = (state: RootState): string =>
  state.customDownload.attributesAccordion.orthologue.searchTerm;

export const getOrthologueShowBestMatches = (state: RootState): boolean =>
  state.customDownload.attributesAccordion.orthologue.showBestMatches;

export const getOrthologueShowAll = (state: RootState): boolean =>
  state.customDownload.attributesAccordion.orthologue.showAll;

export const getOrthologueApplyToAllSpecies = (state: RootState): boolean =>
  state.customDownload.attributesAccordion.orthologue.applyToAllSpecies;

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
