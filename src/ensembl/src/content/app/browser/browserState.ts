import browserStorageService from './browser-storage-service';

import { TrackStates } from './track-panel/trackPanelConfig';

const activeGenomeId = browserStorageService.getActiveGenomeId();
const activeEnsObjectIds = browserStorageService.getActiveEnsObjectIds();
const trackStates = browserStorageService.getTrackStates();
const chrLocations = browserStorageService.getChrLocation();

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

export type ChrLocations = { [genomeId: string]: ChrLocation };

export type CogList = {
  [key: string]: number;
};

export type BrowserState = Readonly<{
  browserActivated: boolean;
}>;

export const defaultBrowserState: BrowserState = {
  browserActivated: false
};

export type BrowserEntityState = Readonly<{
  activeGenomeId: string | null;
  activeEnsObjectIds: { [genomeId: string]: string };
  trackStates: TrackStates;
  messageCounter: number;
}>;

export const defaultBrowserEntityState: BrowserEntityState = {
  activeGenomeId,
  activeEnsObjectIds,
  trackStates,
  messageCounter: -1
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
  chrLocations: ChrLocations; // final location of the browser when user stopped dragging/zooming; used to update the url
  actualChrLocations: ChrLocations; // transient locations that change while user is dragging or zooming
  browserRegionEditorActive: boolean;
}>;

export const defaultBrowserLocationState: BrowserLocationState = {
  chrLocations,
  actualChrLocations: {},
  browserRegionEditorActive: false
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
