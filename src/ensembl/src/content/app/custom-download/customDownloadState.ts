export type CustomDownloadState = Readonly<{
  selectedPreFilter: string;
  showPreFiltersPanel: boolean;
  selectedTabButton: string;
  attributes: any;
  attributesAccordion: any;
  filters: {};
  previewResult: any;
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
  previewResult: {
    resultCount: 0
  }
};
