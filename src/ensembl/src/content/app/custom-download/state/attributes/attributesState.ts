import { AttributeWithOptions } from 'src/content/app/custom-download/types/Attributes';
import JSONValue from 'src/shared/types/JSON';
import { CheckboxGridOption } from 'src/content/app/custom-download/components/checkbox-grid/CheckboxGrid';

export type OrthologueState = {
  searchTerm: string;
  species: CheckboxGridOption[];
  showBestMatches: boolean;
  showAll: boolean;
  applyToAllSpecies: boolean;
};

export type AttributeUi = {
  [key: string]: AttributeWithOptions | { [key: string]: AttributeWithOptions };
};

export type AttributesState = Readonly<{
  expandedPanel: string;
  content: AttributeUi;
  selectedAttributes: JSONValue;
  ui: JSONValue;
  orthologue: OrthologueState;
}>;

export const defaultAttributesState: AttributesState = {
  expandedPanel: '',
  content: {},
  selectedAttributes: {},
  ui: {},
  orthologue: {
    searchTerm: '',
    species: [],
    showBestMatches: false,
    showAll: false,
    applyToAllSpecies: false
  }
};
