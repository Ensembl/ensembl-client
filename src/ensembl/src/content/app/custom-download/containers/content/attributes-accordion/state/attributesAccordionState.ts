import { CustomDownloadAttributes } from 'src/content/app/custom-download/types/Attributes';

export type AttributesAccordionState = Readonly<{
  expandedPanel: string;
  expandedVariationPanels: string[];
  attributes: CustomDownloadAttributes;
  orthologue: {
    searchTerm: string;
    species: {};
    showBestMatches: boolean;
    showAll: boolean;
    applyToAllSpecies: boolean;
  };
}>;

export const defaultAttributesAccordionState: AttributesAccordionState = {
  expandedPanel: '',
  expandedVariationPanels: [],
  attributes: {},
  orthologue: {
    searchTerm: '',
    species: {},
    showBestMatches: false,
    showAll: false,
    applyToAllSpecies: false
  }
};
