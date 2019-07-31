import { RootState } from 'src/store';

import {
  Attributes,
  AttributeWithOptions
} from 'src/content/app/custom-download/types/Attributes';

export const getAttributes = (state: RootState) =>
  state.customDownload.attributes.content as Attributes;

export const getSelectedAttributes = (state: RootState) =>
  state.customDownload.attributes.selectedAttributes;

export const getAttributesUi = (state: RootState) =>
  state.customDownload.attributes.ui;

export const getOrthologueAttributes = (
  state: RootState
): { [key: string]: AttributeWithOptions } =>
  state.customDownload.attributes.content.orthologues as {
    [key: string]: AttributeWithOptions;
  };

export const getOrthologueSearchTerm = (state: RootState) =>
  state.customDownload.attributes.orthologue.searchTerm;

export const getOrthologueShowBestMatches = (state: RootState) =>
  state.customDownload.attributes.orthologue.showBestMatches;

export const getOrthologueShowAll = (state: RootState) =>
  state.customDownload.attributes.orthologue.showAll;

export const getOrthologueApplyToAllSpecies = (state: RootState) =>
  state.customDownload.attributes.orthologue.applyToAllSpecies;

export const getOrthologueSpecies = (state: RootState) =>
  state.customDownload.attributes.orthologue.species;

export const getAttributesAccordionExpandedPanel = (state: RootState) =>
  state.customDownload.attributes.expandedPanel;
