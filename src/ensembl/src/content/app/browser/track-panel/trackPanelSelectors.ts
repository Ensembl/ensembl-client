import { RootState } from 'src/store';
import { getBrowserActiveGenomeId } from '../browserSelectors';
import { defaultTrackPanelStateForGenome } from './trackPanelState';

export const getActiveTrackPanel = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  const activeTrackPanel = activeGenomeId && state.trackPanel[activeGenomeId];

  return activeGenomeId && activeTrackPanel
    ? state.trackPanel[activeGenomeId]
    : defaultTrackPanelStateForGenome;
};

export const getIsTrackPanelModalOpened = (state: RootState) =>
  getActiveTrackPanel(state).isTrackPanelModalOpened;

export const getTrackPanelModalView = (state: RootState) =>
  getActiveTrackPanel(state).trackPanelModalView;

export const getSelectedTrackPanelTab = (state: RootState) =>
  getActiveTrackPanel(state).selectedTrackPanelTab;

export const getIsTrackPanelOpened = (state: RootState) =>
  getActiveTrackPanel(state).isTrackPanelOpened;

export const getBookmarks = (state: RootState) => state.trackPanel.bookmarks;

export const getActiveGenomeBookmarks = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);

  return (
    (activeGenomeId && getActiveTrackPanel(state).bookmarks[activeGenomeId]) ||
    []
  );
};
