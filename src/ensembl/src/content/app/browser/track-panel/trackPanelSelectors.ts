import { RootState } from 'src/store';
import { getBrowserActiveGenomeId } from '../browserSelectors';
import { TrackType } from './trackPanelConfig';

export const getIsTrackPanelModalOpened = (state: RootState) =>
  state.trackPanel.isTrackPanelModalOpened;

export const getTrackPanelModalView = (state: RootState) =>
  state.trackPanel.trackPanelModalView;

export const getSelectedBrowserTab = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);

  return (
    (activeGenomeId && state.trackPanel.selectedBrowserTab[activeGenomeId]) ||
    TrackType.GENOMIC
  );
};

export const getIsTrackPanelOpened = (state: RootState) =>
  state.trackPanel.isTrackPanelOpened;

export const getHighlightedTrack = (state: RootState) =>
  state.trackPanel.highlightedTrack;
