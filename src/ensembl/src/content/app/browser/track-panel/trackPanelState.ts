import { TrackSet } from './trackPanelConfig';
import browserStorageService from '../browser-storage-service';
import trackPanelStorageService from './track-panel-storage-service';
import { ImageButtonStatus } from 'src/shared/image-button/ImageButton';

export type Bookmark = {
  genome_id: string;
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

const bookmarks: {
  [genomeId: string]: Bookmark[];
} = trackPanelStorageService.getBookmarks();

export type TrackPanelStateForGenome = Readonly<{
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  selectedTrackPanelTab: TrackSet;
  trackPanelModalView: string;
  bookmarks: Bookmark[];
}>;

export type TrackPanelState = Readonly<{
  [genomeId: string]: TrackPanelStateForGenome;
}>;

const selectedTrackPanelTabFromStorage = browserStorageService.getSelectedTrackPanelTab();

export const defaultTrackPanelStateForGenome: TrackPanelStateForGenome = {
  isTrackPanelModalOpened: false,
  bookmarks: [],
  isTrackPanelOpened: false,
  selectedTrackPanelTab: TrackSet.GENOMIC,
  trackPanelModalView: ''
};

export const defaultTrackPanelState: TrackPanelState = Object.keys(
  selectedTrackPanelTabFromStorage
).reduce(
  (state: TrackPanelState, genomeId: string) => ({
    ...state,
    [genomeId]: {
      ...defaultTrackPanelStateForGenome,
      selectedTrackPanelTab: selectedTrackPanelTabFromStorage[genomeId],
      bookmarks: bookmarks[genomeId]
    }
  }),
  {}
);
