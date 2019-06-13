import { RootState } from 'src/store';

export const getSelectedPreFilter = (state: RootState): string =>
  state.customDownload.preFilter.selectedPreFilter;

export const getShowPreFilterPanel = (state: RootState): boolean =>
  state.customDownload.preFilter.showPreFiltersPanel;

export const getSelectedTab = (state: RootState): string =>
  state.customDownload.tab.selectedTab;

export const getPreviewResult = (state: RootState): string =>
  state.customDownload.result.preview;

export const getIsLoadingResult = (state: RootState): boolean =>
  state.customDownload.result.isLoadingResult;

export const getShowPreviewResult = (state: RootState): boolean =>
  state.customDownload.previewDownload.showPreview;

export const getDownloadType = (state: RootState): string =>
  state.customDownload.previewDownload.downloadType;
