import { RootState } from 'src/store';

export const getAttributes = (state: RootState): {} =>
  state.customDownload.attributesAccordion.attributes;

export const getSelectedAttributes = (state: RootState): {} =>
  state.customDownload.attributesAccordion.selectedAttributes;

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

export const getOrthologueSpecies = (state: RootState): {} =>
  state.customDownload.attributesAccordion.orthologue.species;

export const getAttributesAccordionExpandedPanel = (state: RootState): string =>
  state.customDownload.attributesAccordion.expandedPanel;
