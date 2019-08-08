import { TrackSet } from './trackPanelConfig';
import browserStorageService from '../browser-storage-service';

export type TrackPanelStateForGenome = Readonly<{
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  selectedBrowserTab: TrackSet;
  trackPanelModalView: string;
}>;

export type TrackPanelState = Readonly<{
  [genomeId: string]: TrackPanelStateForGenome;
}>;

const selectedBrowserTabFromStorage = browserStorageService.getSelectedBrowserTab();

export const defaultTrackPanelStateForGenome: TrackPanelStateForGenome = {
  isTrackPanelModalOpened: false,
  isTrackPanelOpened: false,
  selectedBrowserTab: TrackSet.GENOMIC,
  trackPanelModalView: ''
};

export const defaultTrackPanelState: TrackPanelState = Object.keys(
  selectedBrowserTabFromStorage
).reduce(
  (state: TrackPanelState, genomeId: string) => ({
    ...state,
    [genomeId]: {
      ...defaultTrackPanelStateForGenome,
      selectedBrowserTab: selectedBrowserTabFromStorage[genomeId]
    }
  }),
  {}
);
