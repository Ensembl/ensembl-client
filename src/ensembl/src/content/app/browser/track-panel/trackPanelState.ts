import { TrackType } from './trackPanelConfig';
import browserStorageService from '../browser-storage-service';

export type TrackPanelStateForGenome = Readonly<{
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  selectedBrowserTab: TrackType;
  trackPanelModalView: string;
}>;

export type TrackPanelState = Readonly<{
  [genomeId: string]: TrackPanelStateForGenome;
}>;

const selectedBrowserTabFromStorage = browserStorageService.getSelectedBrowserTab();

export const defaultTrackPanelState: TrackPanelState = Object.keys(
  selectedBrowserTabFromStorage
).reduce(
  (state: TrackPanelState, genomeId: string) => ({
    ...state,
    [genomeId]: {
      selectedBrowserTab: selectedBrowserTabFromStorage[genomeId],
      isTrackPanelModalOpened: false,
      isTrackPanelOpened: false,
      trackPanelModalView: ''
    }
  }),
  {}
);
