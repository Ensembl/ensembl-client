import { TrackType } from './track-panel/trackPanelConfig';

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

export type TrackPanelState = Readonly<{
  selectedBrowserTab: TrackType;
  trackPanelModalOpened: boolean;
  trackPanelModalView: string;
  trackPanelOpened: boolean;
}>;

export const defaultTrackPanelState: TrackPanelState = {
  selectedBrowserTab: TrackType.GENOMIC,
  trackPanelModalOpened: false,
  trackPanelModalView: '',
  trackPanelOpened: true
};

export type DrawerState = Readonly<{
  drawerOpened: boolean;
  drawerView: string;
}>;

export const defaultDrawerState = {
  drawerOpened: false,
  drawerView: ''
};

export type ObjectState = Readonly<{
  objectFetchFailed: boolean;
  objectFetching: boolean;
  objectInfo: object;
  trackCategories: [];
}>;

export const defaultObjectState: ObjectState = {
  objectFetchFailed: false,
  objectFetching: false,
  objectInfo: {},
  trackCategories: []
};

export type ExampleObjectState = Readonly<{
  exampleObjectsFetchFailed: boolean;
  exampleObjectsFetching: boolean;
  examples: {
    [key: string]: {};
  };
}>;

export const defaultExampleObjectState: ExampleObjectState = {
  exampleObjectsFetchFailed: false,
  exampleObjectsFetching: false,
  examples: {}
};
