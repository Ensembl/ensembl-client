import { RootState } from 'src/store';
import { getBrowserActiveGenomeId } from '../browserSelectors';
import { TrackType } from './trackPanelConfig';

export const getIsTrackPanelModalOpened = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);

  return (
    (activeGenomeId &&
      state.trackPanel.isTrackPanelModalOpened[activeGenomeId]) ||
    false
  );
};

export const getTrackPanelModalView = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);

  return (
    (activeGenomeId && state.trackPanel.trackPanelModalView[activeGenomeId]) ||
    ''
  );
};

export const getSelectedBrowserTab = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);

  return (
    (activeGenomeId && state.trackPanel.selectedBrowserTab[activeGenomeId]) ||
    TrackType.GENOMIC
  );
};

export const getIsTrackPanelOpened = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);

  return (
    (activeGenomeId && state.trackPanel.isTrackPanelOpened[activeGenomeId]) ||
    false
  );
};
