import { TrackType } from './trackPanelConfig';
import browserStorageService from '../browser-storage-service';

const selectedBrowserTab = browserStorageService.getSelectedBrowserTab();

export type TrackPanelState = Readonly<{
  isTrackPanelModalOpened: { [genomeId: string]: boolean };
  isTrackPanelOpened: { [genomeId: string]: boolean };
  selectedBrowserTab: { [genomeId: string]: TrackType };
  trackPanelModalView: { [genomeId: string]: string };
}>;

export const defaultTrackPanelState: TrackPanelState = {
  isTrackPanelModalOpened: {},
  isTrackPanelOpened: {},
  selectedBrowserTab,
  trackPanelModalView: {}
};
