import { TrackSet } from './trackPanelConfig';
import browserStorageService from '../browser-storage-service';

export type TrackPanelStateForGenome = Readonly<{
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  selectedTrackPanelTab: TrackSet;
  trackPanelModalView: string;
  highlightedTrack: string;
}>;

export type TrackPanelState = Readonly<{
  [genomeId: string]: TrackPanelStateForGenome;
}>;

const selectedTrackPanelTabFromStorage = browserStorageService.getSelectedTrackPanelTab();

export const defaultTrackPanelStateForGenome: TrackPanelStateForGenome = {
  isTrackPanelModalOpened: false,
  selectedTrackPanelTab: TrackSet.GENOMIC,
  trackPanelModalView: '',
  highlightedTrack: '',
  isTrackPanelOpened: false
};

export const defaultTrackPanelState: TrackPanelState = Object.keys(
  selectedTrackPanelTabFromStorage
).reduce(
  (state: TrackPanelState, genomeId: string) => ({
    ...state,
    [genomeId]: {
      ...defaultTrackPanelStateForGenome,
      selectedTrackPanelTab: selectedTrackPanelTabFromStorage[genomeId]
    }
  }),
  {}
);
