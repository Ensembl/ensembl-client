import { RootState } from 'src/store';

export const getSelectedPreFilter = (state: RootState): string =>
  state.customDownload.preFilter.selectedPreFilter;

export const getShowPreFilterPanel = (state: RootState): boolean =>
  state.customDownload.preFilter.showPreFiltersPanel;

export const getSelectedTabButton = (state: RootState): string =>
  state.customDownload.tabButton.selectedTabButton;

export const getPreviewResult = (state: RootState): string =>
  state.customDownload.resultHolder.previewResult;

export const getIsLoadingResult = (state: RootState): boolean =>
  state.customDownload.resultHolder.isLoadingResult;

export const getShowPreviewResult = (state: RootState): boolean =>
  state.customDownload.previewDownload.showPreview;

export const getDownloadType = (state: RootState): string =>
  state.customDownload.previewDownload.downloadType;
