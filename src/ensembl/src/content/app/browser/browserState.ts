import browserStorageService from './browser-storage-service';

import { TrackStates } from './track-panel/trackPanelConfig';

const activeGenomeId = browserStorageService.getActiveGenomeId();
const activeEnsObjectIds = browserStorageService.getActiveEnsObjectId();
const trackStates = browserStorageService.getTrackStates();
const chrLocations = browserStorageService.getChrLocation();
const defaultChrLocations = browserStorageService.getDefaultChrLocation();

export enum BrowserOpenState {
  EXPANDED = 'expanded',
  SEMI_EXPANDED = 'semiExpanded',
  COLLAPSED = 'collapsed'
}

// states are top, right, bottom, left (TRBL) and minus (zoom out) and plus (zoom in)
export type BrowserNavStates = [
  boolean,
  boolean,
  boolean,
  boolean,
  boolean,
  boolean
];

export type ChrLocation = [string, number, number];

export type ChrLocations = { [ensObjectId: string]: ChrLocation };

export type CogList = {
  [key: string]: number;
};

export type BrowserState = Readonly<{
  browserActivated: boolean;
  browserOpenState: BrowserOpenState;
}>;

export const defaultBrowserState: BrowserState = {
  browserActivated: false,
  browserOpenState: BrowserOpenState.SEMI_EXPANDED
};

export type BrowserEntityState = Readonly<{
  activeGenomeId: string; // FIXME this should be nullable
  activeEnsObjectIds: { [genomeId: string]: string }; // FIXME this should be nullable
  trackStates: TrackStates;
}>;

export const defaultBrowserEntityState: BrowserEntityState = {
  activeGenomeId, // FIXME this can be null
  activeEnsObjectIds, // FIXME this can be null
  trackStates
};

export type BrowserNavState = Readonly<{
  browserNavOpened: boolean;
  browserNavStates: BrowserNavStates;
}>;

export const defaultBrowserNavState: BrowserNavState = {
  browserNavOpened: false,
  browserNavStates: [true, true, true, true, true, true]
};

export type BrowserLocationState = Readonly<{
  chrLocations: ChrLocations;
  defaultChrLocations: ChrLocations;
  genomeSelectorActive: boolean;
}>;

export const defaultBrowserLocationState: BrowserLocationState = {
  chrLocations,
  defaultChrLocations,
  genomeSelectorActive: false
};

export type TrackConfigState = Readonly<{
  applyToAll: boolean;
  browserCogList: number;
  browserCogTrackList: CogList;
  selectedCog: string;
  trackConfigNames: any;
  trackConfigLabel: any;
}>;

export const defaultTrackConfigState: TrackConfigState = {
  applyToAll: false,
  browserCogList: 0,
  browserCogTrackList: {},
  selectedCog: '',
  trackConfigLabel: {},
  trackConfigNames: {}
};
