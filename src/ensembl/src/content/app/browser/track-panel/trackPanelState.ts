import { TrackType } from './trackPanelConfig';
import browserStorageService from '../browser-storage-service';

export type TrackPanelState = Readonly<{
  [genomeId: string]: {
    isTrackPanelModalOpened: boolean;
    isTrackPanelOpened: boolean;
    selectedBrowserTab: TrackType;
    trackPanelModalView: string;
  };
}>;

const selectedBrowserTabFromStorage = browserStorageService.getSelectedBrowserTab();

// create the default state using the stored selected browser tab object
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
