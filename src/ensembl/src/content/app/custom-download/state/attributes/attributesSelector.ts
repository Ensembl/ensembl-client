import { RootState } from 'src/store';

import {
  Attributes,
  AttributeWithOptions
} from 'src/content/app/custom-download/types/Attributes';
import { getCustomDownloadActiveGenomeConfiguration } from '../customDownloadSelectors';

export const getSelectedPreFilter = (state: RootState) => {
  const activeGenomeState = getCustomDownloadActiveGenomeConfiguration(state);

  return activeGenomeState ? activeGenomeState.preFilter.selectedPreFilter : '';
};

export const getAttributes = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes
    .content as Attributes;

export const getSelectedAttributes = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes
    .selectedAttributes;

export const getAttributesUi = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes.ui;

export const getOrthologueAttributes = (
  state: RootState
): { [key: string]: AttributeWithOptions } =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes.content
    .orthologues as {
    [key: string]: AttributeWithOptions;
  };

export const getOrthologueSearchTerm = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes.orthologue
    .searchTerm;

export const getOrthologueShowBestMatches = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes.orthologue
    .showBestMatches;

export const getOrthologueShowAll = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes.orthologue
    .showAll;

export const getOrthologueApplyToAllSpecies = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes.orthologue
    .applyToAllSpecies;

export const getOrthologueSpecies = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes.orthologue
    .species;

export const getAttributesAccordionExpandedPanels = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes.expandedPanels ||
  [];
