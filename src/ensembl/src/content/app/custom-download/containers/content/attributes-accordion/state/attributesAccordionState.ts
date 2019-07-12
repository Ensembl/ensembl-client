import { Attributes } from 'src/content/app/custom-download/types/Attributes';

export type OrthologueState = {
  searchTerm: string;
  species: {};
  showBestMatches: boolean;
  showAll: boolean;
  applyToAllSpecies: boolean;
};

export type AttributesAccordionState = Readonly<{
  expandedPanel: string;
  attributes: Attributes;
  selectedAttributes: Attributes;
  contentState: any;
  orthologue: OrthologueState;
}>;

export const defaultAttributesAccordionState: AttributesAccordionState = {
  expandedPanel: '',
  attributes: {},
  selectedAttributes: {},
  contentState: {},
  orthologue: {
    searchTerm: '',
    species: {},
    showBestMatches: false,
    showAll: false,
    applyToAllSpecies: false
  }
};
