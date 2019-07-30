import { AttributeWithOptions } from 'src/content/app/custom-download/types/Attributes';
import JSONValue from 'src/shared/types/JSON';
import { CheckboxGridOption } from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';
import customDownloadStorageService from 'src/content/app/custom-download/services/custom-download-storage-service';

export type OrthologueState = {
  searchTerm: string;
  species: CheckboxGridOption[];
  showBestMatches: boolean;
  showAll: boolean;
  applyToAllSpecies: boolean;
};

export type AttributeContentState = {
  [key: string]: AttributeWithOptions | { [key: string]: AttributeWithOptions };
};

export type AttributesAccordionState = Readonly<{
  expandedPanel: string;
  content: AttributeContentState;
  selectedAttributes: JSONValue;
  contentState: JSONValue;
  orthologue: OrthologueState;
}>;

export const defaultAttributesAccordionState: AttributesAccordionState = {
  expandedPanel: '',
  content: {},
  selectedAttributes: customDownloadStorageService.getSelectedAttributes(),
  contentState: {},
  orthologue: {
    searchTerm: '',
    species: [],
    showBestMatches: false,
    showAll: false,
    applyToAllSpecies: false
  }
};
