import { TrackType } from './trackPanelConfig';
import browserStorageService from '../browser-storage-service';
import { ImageButtonStatus } from 'src/shared/image-button/ImageButton';

const selectedBrowserTab = browserStorageService.getSelectedBrowserTab();

export type Bookmark = {
  object_id: string;
  object_type: string;
  location: {
    chromosome: string;
    start: number;
    end: number;
  };
  label: string;
  trackStates: {
    [categoryName: string]: {
      [trackName: string]: ImageButtonStatus;
    };
  };
};

export type TrackPanelState = Readonly<{
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  selectedBrowserTab: { [genomeId: string]: TrackType };
  trackPanelModalView: string;
  bookmarks: { [genomeId: string]: Bookmark[] };
}>;

export const defaultTrackPanelState: TrackPanelState = {
  isTrackPanelModalOpened: false,
  isTrackPanelOpened: true,
  selectedBrowserTab,
  trackPanelModalView: '',
  bookmarks: {}
};
