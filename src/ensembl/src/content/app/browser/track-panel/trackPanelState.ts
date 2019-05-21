import { TrackType } from './trackPanelConfig';
import browserStorageService from '../browser-storage-service';

const selectedBrowserTab = browserStorageService.getSelectedBrowserTab();

export type TrackPanelState = Readonly<{
  selectedBrowserTab: TrackType;
  trackPanelModalOpened: boolean;
  trackPanelModalView: string;
  trackPanelOpened: boolean;
}>;

export const defaultTrackPanelState: TrackPanelState = {
  selectedBrowserTab: selectedBrowserTab || TrackType.GENOMIC,
  trackPanelModalOpened: false,
  trackPanelModalView: '',
  trackPanelOpened: true
};
