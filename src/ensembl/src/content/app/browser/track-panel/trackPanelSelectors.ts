import { RootState } from 'src/store';
import { getBrowserActiveGenomeId } from '../browserSelectors';
import { TrackType } from './trackPanelConfig';
import { TrackPanelStateForGenome } from './trackPanelState';

const getTrackPanelStateProp = (
  state: RootState,
  prop: keyof TrackPanelStateForGenome
) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  const trackPanelStateForGenome = activeGenomeId
    ? state.trackPanel[activeGenomeId]
    : null;

  return trackPanelStateForGenome ? trackPanelStateForGenome[prop] : null;
};

export const getIsTrackPanelModalOpened = (state: RootState) =>
  (getTrackPanelStateProp(state, 'isTrackPanelModalOpened') as boolean) ||
  false;

export const getTrackPanelModalView = (state: RootState) =>
  (getTrackPanelStateProp(state, 'trackPanelModalView') as string) || '';

export const getSelectedBrowserTab = (state: RootState) =>
  (getTrackPanelStateProp(state, 'selectedBrowserTab') as TrackType) ||
  TrackType.GENOMIC;

export const getIsTrackPanelOpened = (state: RootState) =>
  (getTrackPanelStateProp(state, 'isTrackPanelOpened') as boolean) || false;
