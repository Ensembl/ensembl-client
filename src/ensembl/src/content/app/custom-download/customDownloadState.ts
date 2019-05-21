export type ResultState = Readonly<{
  previewResult: any;
  isLoadingResult: boolean;
}>;

export const defaultResultState: ResultState = {
  previewResult: {
    resultCount: 0
  },
  isLoadingResult: false
};

export type TabButtonState = Readonly<{
  selectedTabButton: string;
}>;

export const defaultTabButtonState: TabButtonState = {
  selectedTabButton: 'attributes'
};

export type PreFilterState = Readonly<{
  selectedPreFilter: string;
  showPreFiltersPanel: boolean;
}>;

export const defaultPreFilterState: PreFilterState = {
  selectedPreFilter: '',
  showPreFiltersPanel: true
};

export type PreviewDownloadState = Readonly<{
  showPreview: boolean;
  downloadType: string;
}>;

export const defaultPreviewDownloadState: PreviewDownloadState = {
  showPreview: false,
  downloadType: ''
};
