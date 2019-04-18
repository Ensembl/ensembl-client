export type CustomDownloadState = Readonly<{
  selectedPreFilter: string;
  showPreFiltersPanel: boolean;
  selectedTabButton: string;
  attributes: any;
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
  attributes: {},
  attributesAccordion: {
    expandedPanel: '',
    expandedVariationPanels: []
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
