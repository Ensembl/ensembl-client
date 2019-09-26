import pick from 'lodash/pick';

import { TrackSet } from './trackPanelConfig';
import browserStorageService from '../browser-storage-service';

export type TrackPanelStateForGenome = Readonly<{
  isTrackPanelModalOpened: boolean;
  isTrackPanelOpened: boolean;
  selectedTrackPanelTab: TrackSet;
  trackPanelModalView: string;
  highlightedTrackId: string;
  collapsedTrackIds: string[];
}>;

export type TrackPanelState = Readonly<{
  [genomeId: string]: TrackPanelStateForGenome;
}>;

export const defaultTrackPanelStateForGenome: TrackPanelStateForGenome = {
  isTrackPanelModalOpened: false,
  selectedTrackPanelTab: TrackSet.GENOMIC,
  trackPanelModalView: '',
  highlightedTrackId: '',
  isTrackPanelOpened: true,
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
    'collapsedTrackIds'
  ];
  return pick(trackPanel, persistentProperties);
};
