import { DrawerSection } from './drawer/drawerSectionConfig';

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

export type BrowserState = Readonly<{
  browserNavOpened: boolean;
  browserNavStates: BrowserNavStates;
  browserOpenState: BrowserOpenState;
  currentDrawerSection: string;
  currentTrack: string;
  drawerOpened: boolean;
  drawerSections: DrawerSection[];
  trackPanelOpened: boolean;
}>;

export const defaultState: BrowserState = {
  browserNavOpened: false,
  browserNavStates: [true, true, true, true, true, true],
  browserOpenState: BrowserOpenState.SEMI_EXPANDED,
  currentDrawerSection: '',
  currentTrack: '',
  drawerOpened: false,
  drawerSections: [],
  trackPanelOpened: true
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
      ...defaultState
    };
  }
};
