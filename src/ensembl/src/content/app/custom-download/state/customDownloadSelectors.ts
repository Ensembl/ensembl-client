import { RootState } from 'src/store';
import { defaultCustomDownloadStateForGenome } from './customDownloadState';

export const getCustomDownloadActiveGenomeId = (state: RootState) =>
  state.customDownload.activeGenomeId || null;

export const getCustomDownloadActiveGenomeConfiguration = (
  state: RootState
) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(state);

  if (!activeGenomeId) {
    return defaultCustomDownloadStateForGenome;
  }
  return (
    state.customDownload.activeConfigurations[activeGenomeId] ||
    defaultCustomDownloadStateForGenome
  );
};

export const getSelectedPreFilter = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).preFilter.selectedPreFilter;

export const getShowPreFilterPanel = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).preFilter
    .showPreFiltersPanel;

export const getPreviewResult = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).result.preview;

export const getIsLoadingResult = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).result.isLoadingResult;

export const getShowPreviewResult = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).previewDownload.showSummary;

export const getShowExampleData = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).previewDownload
    .showExampleData;

export const getDownloadType = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).previewDownload
    .downloadType;
