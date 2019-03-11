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
  applyToAll: boolean;
  browserActivated: boolean;
  browserCogList: number;
  browserCogTrackList: CogList;
  browserNavOpened: boolean;
  browserNavStates: BrowserNavStates;
  browserOpenState: BrowserOpenState;
  chrLocation: ChrLocation;
  defaultChrLocation: ChrLocation;
  drawerOpened: boolean;
  drawerView: string;
  genomeSelectorActive: boolean;
  selectedBrowserTab: TrackType;
  selectedCog: string;
  trackConfigNames: any;
  trackConfigLabel: any;
  trackPanelModalOpened: boolean;
  trackPanelModalView: string;
  trackPanelOpened: boolean;
}>;

export const defaultBrowserState: BrowserState = {
  applyToAll: false,
  browserActivated: false,
  browserCogList: 0,
  browserCogTrackList: {},
  browserNavOpened: false,
  browserNavStates: [true, true, true, true, true, true],
  browserOpenState: BrowserOpenState.SEMI_EXPANDED,
  chrLocation: ['13', 0, 0],
  defaultChrLocation: ['13', 0, 0],
  drawerOpened: false,
  drawerView: '',
  genomeSelectorActive: false,
  selectedBrowserTab: TrackType.GENOMIC,
  selectedCog: '',
  trackConfigLabel: {},
  trackConfigNames: {},
  trackPanelModalOpened: false,
  trackPanelModalView: '',
  trackPanelOpened: true
};

export type ExampleObjects = Readonly<{
  exampleObjectsFetchFailed: boolean;
  exampleObjectsFetching: boolean;
  examples: {
    [key: string]: {};
  };
}>;

export const defaultExampleObjects: ExampleObjects = {
  exampleObjectsFetchFailed: false,
  exampleObjectsFetching: false,
  examples: {}
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

export const trackPanelState = (
  state: BrowserState,
  trackPanelOpened: boolean = !state.trackPanelOpened
) => {
  const browserOpenState: BrowserOpenState = trackPanelOpened
    ? BrowserOpenState.SEMI_EXPANDED
    : BrowserOpenState.EXPANDED;

  return {
    ...state,
    browserOpenState,
    trackPanelOpened
  };
};

export const drawerState = (
  state: BrowserState,
  drawerOpened: boolean = !state.drawerOpened
) => {
  if (drawerOpened === true) {
    return {
      ...state,
      browserOpenState: BrowserOpenState.COLLAPSED,
      drawerOpened
    };
  } else {
    return {
      ...state,
      browserOpenState: BrowserOpenState.SEMI_EXPANDED,
      drawerOpened,
      drawerView: ''
    };
  }
};
