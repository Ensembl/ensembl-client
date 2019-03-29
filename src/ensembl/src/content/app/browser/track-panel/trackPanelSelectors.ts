import { RootState } from 'src/store';
import { TrackType } from './trackPanelConfig';

export const getTrackPanelModalOpened = (state: RootState): boolean =>
  state.trackPanel.trackPanelModalOpened;

export const getTrackPanelModalView = (state: RootState): string =>
  state.trackPanel.trackPanelModalView;

export const getSelectedBrowserTab = (state: RootState): TrackType =>
  state.trackPanel.selectedBrowserTab;

export const getTrackPanelOpened = (state: RootState): boolean =>
  state.trackPanel.trackPanelOpened;
