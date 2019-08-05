import { RootState } from 'src/store';
import { getBrowserActiveGenomeId } from '../browserSelectors';
import { TrackType } from './trackPanelConfig';

const getTrackPanelStateForGenome = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  const trackPanelStateForGenome = activeGenomeId
    ? state.trackPanel[activeGenomeId]
    : null;

  return trackPanelStateForGenome || null;
};

export const getIsTrackPanelModalOpened = (state: RootState) => {
  const trackPanelStateForGenome = getTrackPanelStateForGenome(state);
  return trackPanelStateForGenome
    ? trackPanelStateForGenome['isTrackPanelModalOpened']
    : false;
};

export const getTrackPanelModalView = (state: RootState) => {
  const trackPanelStateForGenome = getTrackPanelStateForGenome(state);
  return trackPanelStateForGenome
    ? trackPanelStateForGenome['trackPanelModalView']
    : '';
};

export const getSelectedBrowserTab = (state: RootState) => {
  const trackPanelStateForGenome = getTrackPanelStateForGenome(state);
  return trackPanelStateForGenome
    ? trackPanelStateForGenome['selectedBrowserTab']
    : TrackType.GENOMIC;
};

export const getIsTrackPanelOpened = (state: RootState) => {
  const trackPanelStateForGenome = getTrackPanelStateForGenome(state);
  return trackPanelStateForGenome
    ? trackPanelStateForGenome['isTrackPanelOpened']
    : false;
};
