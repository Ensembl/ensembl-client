export type CustomDownloadState = Readonly<{
  selectedPreFilter: string;
  showPreFiltersPanel: boolean;
  selectedTabButton: string;
  attributesAccordion: any;
  filtersAccordion: any;
  filters: any;
  previewResult: any;
  isLoadingResult: boolean;
}>;

export const defaultCustomDownloadState: CustomDownloadState = {
  selectedPreFilter: '',
  showPreFiltersPanel: false,
  selectedTabButton: 'attributes',
  attributesAccordion: {
    expandedPanel: 'orthologues',
    expandedVariationPanels: [],
    attributes: {},
    orthologue: {
      searchTerm: '',
      species: []
    }
  },
  filters: {},
  filtersAccordion: {
    expandedPanel: '',
    expandedGenePanels: []
  },
  previewResult: {
    resultCount: 0
  },
  isLoadingResult: false
};
