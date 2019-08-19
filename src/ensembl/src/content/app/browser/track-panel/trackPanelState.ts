import { TrackSet, GenomeTrackStates } from './trackPanelConfig';
import browserStorageService from '../browser-storage-service';
import trackPanelStorageService from './track-panel-storage-service';

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
  trackStates: GenomeTrackStates;
};

export type Bookmarks = {
  [genomeId: string]: Bookmark[];
};

const bookmarksFromStorage: Bookmarks = trackPanelStorageService.getBookmarks();
const previouslyViewedObjectsFromStorage: Bookmarks = trackPanelStorageService.getPreviouslyViewedObjects();

export type TrackPanelStateForGenome = Readonly<{
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  selectedTrackPanelTab: TrackSet;
  trackPanelModalView: string;
  bookmarks: Bookmark[];
  previouslyViewedObjects: Bookmark[];
}>;

export type TrackPanelState = Readonly<{
  [genomeId: string]: TrackPanelStateForGenome;
}>;

const selectedTrackPanelTabFromStorage = browserStorageService.getSelectedTrackPanelTab();

export const defaultTrackPanelStateForGenome: TrackPanelStateForGenome = {
  isTrackPanelModalOpened: false,
  bookmarks: [],
  previouslyViewedObjects: [],
  isTrackPanelOpened: false,
  selectedTrackPanelTab: TrackSet.GENOMIC,
  trackPanelModalView: ''
};

const availableGenomeIdsFromStorage = [
  ...Object.keys(selectedTrackPanelTabFromStorage),
  ...Object.keys(bookmarksFromStorage),
  ...Object.keys(previouslyViewedObjectsFromStorage)
];

export const defaultTrackPanelState: TrackPanelState = availableGenomeIdsFromStorage.reduce(
  (state: TrackPanelState, genomeId: string) => ({
    ...state,
    [genomeId]: {
      ...defaultTrackPanelStateForGenome,
      selectedTrackPanelTab: selectedTrackPanelTabFromStorage[genomeId],
      bookmarks: bookmarksFromStorage[genomeId],
      previouslyViewedObjects: previouslyViewedObjectsFromStorage[genomeId]
    }
  }),
  {}
);
