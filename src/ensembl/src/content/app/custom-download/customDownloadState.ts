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
  showPreFiltersPanel: true,
  selectedTabButton: 'attributes',
  attributesAccordion: {
    expandedPanel: '',
    expandedVariationPanels: [],
    attributes: {}
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
