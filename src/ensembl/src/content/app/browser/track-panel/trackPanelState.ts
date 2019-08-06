import { TrackType } from './trackPanelConfig';
import browserStorageService from '../browser-storage-service';

const selectedBrowserTab = browserStorageService.getSelectedBrowserTab();

export type TrackPanelState = Readonly<{
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  selectedBrowserTab: { [genomeId: string]: TrackType };
  trackPanelModalView: string;
  highlightedTrack: string;
}>;

export const defaultTrackPanelState: TrackPanelState = {
  isTrackPanelModalOpened: false,
  isTrackPanelOpened: true,
  selectedBrowserTab,
  trackPanelModalView: '',
  highlightedTrack: ''
};
