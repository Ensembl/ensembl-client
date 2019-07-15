import { RootState } from 'src/store';

import { Attributes } from '../../../../types/Attributes';
import { OrthologueState } from './attributesAccordionState';

export const getAttributes = (state: RootState): Attributes =>
  state.customDownload.attributesAccordion.attributes;

export const getSelectedAttributes = (state: RootState): Attributes =>
  state.customDownload.attributesAccordion.selectedAttributes;

export const getContentState = (state: RootState): {} =>
  state.customDownload.attributesAccordion.contentState;

export const getOrthologueAttributes = (state: RootState): OrthologueState =>
  state.customDownload.attributesAccordion.orthologue;

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
