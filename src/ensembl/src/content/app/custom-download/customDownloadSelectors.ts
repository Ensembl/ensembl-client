import { RootState } from 'src/store';

export const getSelectedPreFilter = (state: RootState): string =>
  state.customDownload.preFilterPanel.selectedPreFilter;

export const getShowPreFilterPanel = (state: RootState): boolean =>
  state.customDownload.preFilterPanel.showPreFiltersPanel;

export const getSelectedTabButton = (state: RootState): string =>
  state.customDownload.contentPanel.selectedTabButton;

export const getSelectedGeneDataToDownload = (state: RootState): string =>
  state.customDownload.contentPanel.attributes.gene;

export const getSelectedTranscriptDataToDownload = (state: RootState): string =>
  state.customDownload.contentPanel.attributes.transcript;
