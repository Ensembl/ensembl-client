import JSONValue from 'src/shared/types/JSON';

export type ResultState = Readonly<{
  preview: JSONValue;
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
  showSummary: boolean;
  showExampleData: boolean;
  downloadType: string;
}>;

export const defaultPreviewDownloadState: PreviewDownloadState = {
  showSummary: false,
  showExampleData: false,
  downloadType: ''
};
