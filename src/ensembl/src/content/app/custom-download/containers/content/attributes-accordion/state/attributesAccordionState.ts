export type AttributesAccordionState = Readonly<{
  expandedPanel: string;
  expandedVariationPanels: any;
  attributes: any;
  orthologue: any;
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
