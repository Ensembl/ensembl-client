import { RootState } from 'src/store';
import { getBrowserActiveGenomeId } from '../browserSelectors';
import { defaultTrackPanelStateForGenome } from './trackPanelState';

export const getActiveTrackPanel = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return activeGenomeId
    ? state.trackPanel[activeGenomeId]
    : defaultTrackPanelStateForGenome;
};

export const getIsTrackPanelModalOpened = (state: RootState) =>
  getActiveTrackPanel(state).isTrackPanelModalOpened;

export const getTrackPanelModalView = (state: RootState) =>
  getActiveTrackPanel(state).trackPanelModalView;

export const getSelectedBrowserTab = (state: RootState) =>
  getActiveTrackPanel(state).selectedBrowserTab;

export const getIsTrackPanelOpened = (state: RootState) =>
  getActiveTrackPanel(state).isTrackPanelOpened;
