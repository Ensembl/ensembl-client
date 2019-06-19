export type ResultState = Readonly<{
  preview: any;
  isLoadingResult: boolean;
}>;

export const defaultResultState: ResultState = {
  preview: {
    resultCount: 0
  },
  isLoadingResult: false
};

export type TabState = Readonly<{
  selectedTab: string;
}>;

export const defaultTabState: TabState = {
  selectedTab: 'attributes'
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
