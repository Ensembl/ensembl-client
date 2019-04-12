import { RootState } from 'src/store';

export const getPreFilterStatuses = (state: RootState): {} =>
  state.customDownload.preFilterPanel.preFilterStatuses;

export const getShowPreFilterPanel = (state: RootState): boolean =>
  state.customDownload.preFilterPanel.showPreFiltersPanel;

export const getSelectedTabButton = (state: RootState): string =>
  state.customDownload.contentPanel.selectedTabButton;
