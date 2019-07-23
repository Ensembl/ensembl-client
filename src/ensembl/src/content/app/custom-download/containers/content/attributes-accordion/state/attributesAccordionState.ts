import Attributes from 'src/content/app/custom-download/types/Attributes';
import JSONValue, { PrimitiveOrArrayValue } from 'src/shared/types/JSON';

export type OrthologueState = {
  searchTerm: string;
  species: PrimitiveOrArrayValue;
  showBestMatches: boolean;
  showAll: boolean;
  applyToAllSpecies: boolean;
};

export type AttributesAccordionState = Readonly<{
  expandedPanel: string;
  content: Attributes;
  selectedAttributes: JSONValue;
  contentState: JSONValue;
  orthologue: OrthologueState;
}>;

export const defaultAttributesAccordionState: AttributesAccordionState = {
  expandedPanel: '',
  content: {},
  selectedAttributes: {},
  contentState: {},
  orthologue: {
    searchTerm: '',
    species: [],
    showBestMatches: false,
    showAll: false,
    applyToAllSpecies: false
  }
};
