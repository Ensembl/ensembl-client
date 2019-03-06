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

export type CogList = number;

export type BrowserState = Readonly<{
  browserActivated: boolean;
  browserNavOpened: boolean;
  browserNavStates: BrowserNavStates;
  browserOpenState: BrowserOpenState;
  chrLocation: ChrLocation;
  defaultChrLocation: ChrLocation;
  drawerOpened: boolean;
  drawerView: string;
  trackPanelModalOpened: boolean;
  trackPanelModalView: string;
  trackPanelOpened: boolean;
  browserCogList: CogList;
  selectedCog: number | null;
  browserCogTrackList: Array<number>;
}>;

export const defaultState: BrowserState = {
  browserActivated: false,
  browserNavOpened: false,
  browserNavStates: [true, true, true, true, true, true],
  browserOpenState: BrowserOpenState.SEMI_EXPANDED,
  chrLocation: ['13', 0, 0],
  defaultChrLocation: ['13', 0, 0],
  drawerOpened: false,
  drawerView: '',
  trackPanelModalOpened: false,
  trackPanelModalView: '',
  trackPanelOpened: true,
  browserCogList: [],
  selectedCog: null,
  browserCogTrackList: []
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
