import { CustomDownloadAttributes } from 'src/content/app/custom-download/types/Attributes';

export type OrthologueState = {
  searchTerm: string;
  species: {};
  showBestMatches: boolean;
  showAll: boolean;
  applyToAllSpecies: boolean;
};

export type AttributesAccordionState = Readonly<{
  expandedPanel: string;
  expandedVariationPanels: string[];
  attributes: CustomDownloadAttributes;
  selectedAttributes: CustomDownloadAttributes;
  orthologue: OrthologueState;
}>;

export const defaultAttributesAccordionState: AttributesAccordionState = {
  expandedPanel: '',
  expandedVariationPanels: [],
  attributes: {},
  selectedAttributes: {},
  orthologue: {
    searchTerm: '',
    species: {},
    showBestMatches: false,
    showAll: false,
    applyToAllSpecies: false
  }
};
