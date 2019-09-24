import { TrackSet, GenomeTrackStates } from './trackPanelConfig';
import browserStorageService from '../browser-storage-service';
import pick from 'lodash/pick';

export type Bookmark = {
  genome_id: string;
  object_id: string;
  object_type: string;
  label: string;
  trackStates: GenomeTrackStates;
};

export type Bookmarks = {
  [genomeId: string]: Bookmark[];
};

export type TrackPanelStateForGenome = Readonly<{
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  selectedTrackPanelTab: TrackSet;
  trackPanelModalView: string;
  bookmarks: Bookmark[];
  previouslyViewedObjects: Bookmark[];
  highlightedTrackId: string;
  collapsedTrackIds: string[];
}>;

export type TrackPanelState = Readonly<{
  [genomeId: string]: TrackPanelStateForGenome;
}>;

export const defaultTrackPanelStateForGenome: TrackPanelStateForGenome = {
  isTrackPanelModalOpened: false,
  bookmarks: [],
  previouslyViewedObjects: [],
  isTrackPanelOpened: false,
  selectedTrackPanelTab: TrackSet.GENOMIC,
  trackPanelModalView: '',
  highlightedTrackId: '',
  collapsedTrackIds: []
};

export const getInitialTrackPanelState = (): TrackPanelState => {
  const genomeId = browserStorageService.getActiveGenomeId();
  return genomeId ? { [genomeId]: getTrackPanelStateForGenome(genomeId) } : {};
};

export const getTrackPanelStateForGenome = (
  genomeId: string
): TrackPanelStateForGenome => {
  const storedTrackPanel =
    browserStorageService.getTrackPanels()[genomeId] || {};
  return {
    ...defaultTrackPanelStateForGenome,
    ...storedTrackPanel
  };
};

export const pickPersistentTrackPanelProperties = (
  trackPanel: Partial<TrackPanelStateForGenome>
) => {
  const persistentProperties = [
    'selectedTrackPanelTab',
    'isTrackPanelOpened',
    'collapsedTrackIds',
    'previouslyViewedObjects'
  ];
  return pick(trackPanel, persistentProperties);
};
