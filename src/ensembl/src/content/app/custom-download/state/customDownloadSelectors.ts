import { RootState } from 'src/store';
import { defaultCustomDownloadStateForGenome } from './customDownloadState';
import cloneDeep from 'lodash/cloneDeep';

export const getCustomDownloadActiveGenomeId = (state: RootState) =>
  state.customDownload.activeGenomeId || null;

export const getCustomDownloadActiveGenomeConfiguration = (
  state: RootState
) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(state);

  if (!activeGenomeId) {
    return cloneDeep(defaultCustomDownloadStateForGenome);
  }
  return (
    state.customDownload.activeConfigurations[activeGenomeId] ||
    cloneDeep(defaultCustomDownloadStateForGenome)
  );
};

export const getActiveConfigurations = (state: RootState) =>
  state.customDownload.activeConfigurations;
export const getSelectedPreFilter = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).preFilter.selectedPreFilter;

export const getShowPreFilterPanel = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).preFilter
    .showPreFiltersPanel;

export const getPreviewResult = (state: RootState) =>
  state.customDownload.result.preview;

export const getIsLoadingResult = (state: RootState) =>
  state.customDownload.result.isLoadingResult;

export const getShowPreviewResult = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).previewDownload.showSummary;

export const getShowExampleData = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).previewDownload
    .showExampleData;

export const getDownloadType = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).previewDownload
    .downloadType;
