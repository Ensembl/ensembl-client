import { RootState } from 'src/store';
import { getBrowserActiveEnsObjectId } from '../browserSelectors';
import { TrackType } from './trackPanelConfig';

export const getTrackPanelModalOpened = (state: RootState) =>
  state.trackPanel.trackPanelModalOpened;

export const getTrackPanelModalView = (state: RootState) =>
  state.trackPanel.trackPanelModalView;

export const getSelectedBrowserTab = (state: RootState) => {
  const activeGenomeId = getBrowserActiveEnsObjectId(state);

  return activeGenomeId
    ? state.trackPanel.selectedBrowserTab[activeGenomeId]
    : TrackType.GENOMIC;
};

export const getTrackPanelOpened = (state: RootState) =>
  state.trackPanel.trackPanelOpened;
