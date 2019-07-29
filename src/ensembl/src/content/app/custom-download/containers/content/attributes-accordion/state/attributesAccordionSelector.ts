import { RootState } from 'src/store';

import Attributes, {
  AttributeWithOptions
} from 'src/content/app/custom-download/types/Attributes';
import JSONValue from 'src/shared/types/JSON';
import { CheckboxGridOption } from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

export const getAttributes = (state: RootState): Attributes =>
  state.customDownload.attributes.content as Attributes;

export const getSelectedAttributes = (state: RootState): JSONValue =>
  state.customDownload.attributes.selectedAttributes;

export const getContentState = (state: RootState): JSONValue =>
  state.customDownload.attributes.contentState;

export const getOrthologueAttributes = (
  state: RootState
): { [key: string]: AttributeWithOptions } =>
  state.customDownload.attributes.content.orthologues as {
    [key: string]: AttributeWithOptions;
  };

export const getOrthologueSearchTerm = (state: RootState): string =>
  state.customDownload.attributes.orthologue.searchTerm;

export const getOrthologueShowBestMatches = (state: RootState): boolean =>
  state.customDownload.attributes.orthologue.showBestMatches;

export const getOrthologueShowAll = (state: RootState): boolean =>
  state.customDownload.attributes.orthologue.showAll;

export const getOrthologueApplyToAllSpecies = (state: RootState): boolean =>
  state.customDownload.attributes.orthologue.applyToAllSpecies;

export const getOrthologueSpecies = (state: RootState): CheckboxGridOption[] =>
  state.customDownload.attributes.orthologue.species;

export const getAttributesAccordionExpandedPanel = (state: RootState): string =>
  state.customDownload.attributes.expandedPanel;
