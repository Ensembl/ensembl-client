import { RootState } from 'src/store';
import { getBrowserActiveGenomeId } from '../browserSelectors';
import { defaultTrackPanelStateForGenome } from './trackPanelState';

export const getActiveTrackPanel = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  const activeTrackPanel =
    activeGenomeId && state.browser.trackPanel[activeGenomeId];

  return activeTrackPanel || defaultTrackPanelStateForGenome;
};

export const getIsTrackPanelModalOpened = (state: RootState) =>
  getActiveTrackPanel(state).isTrackPanelModalOpened;

export const getTrackPanelModalView = (state: RootState) =>
  getActiveTrackPanel(state).trackPanelModalView;

export const getSelectedTrackPanelTab = (state: RootState) =>
  getActiveTrackPanel(state).selectedTrackPanelTab;

export const getIsTrackPanelOpened = (state: RootState) =>
  getActiveTrackPanel(state).isTrackPanelOpened;

export const getActiveGenomeBookmarks = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return (activeGenomeId && getActiveTrackPanel(state).bookmarks) || [];
};

export const getActiveGenomePreviouslyViewedObjects = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);

  return (
    (activeGenomeId && getActiveTrackPanel(state).previouslyViewedObjects) || []
  );
};

export const getHighlightedTrackId = (state: RootState) =>
  getActiveTrackPanel(state).highlightedTrackId;

export const isTrackCollapsed = (state: RootState, trackId: string) => {
  const trackPanel = getActiveTrackPanel(state);
  return trackPanel.collapsedTrackIds.includes(trackId);
};
