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
  activeGenomeId: string;
  activeRegion: ChrLocation;
}>;

export const defaultBrowserEntityState: BrowserEntityState = {
  activeGenomeId: '',
  activeRegion: ['', 0, 0]
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
  chrLocation: ChrLocation;
  defaultChrLocation: ChrLocation;
  genomeSelectorActive: boolean;
}>;

export const defaultBrowserLocationState: BrowserLocationState = {
  chrLocation: ['13', 0, 0],
  defaultChrLocation: ['13', 0, 0],
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
