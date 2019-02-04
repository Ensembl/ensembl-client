import { DrawerSection } from './drawer/drawerSectionConfig';

export enum BrowserOpenState {
  EXPANDED = 'expanded',
  SEMI_EXPANDED = 'semiExpanded',
  COLLAPSED = 'collapsed'
}

export type BrowserState = Readonly<{
  browserNavOpened: boolean;
  browserOpenState: BrowserOpenState;
  currentDrawerSection: string;
  currentTrack: string;
  drawerOpened: boolean;
  drawerSections: DrawerSection[];
  trackPanelOpened: boolean;
}>;

export const defaultState: BrowserState = {
  browserNavOpened: false,
  browserOpenState: BrowserOpenState.SEMI_EXPANDED,
  currentDrawerSection: '',
  currentTrack: '',
  drawerOpened: false,
  drawerSections: [],
  trackPanelOpened: true
};

export const trackPanelState = (state: BrowserState) => {
  const trackPanelOpened: boolean = !state.trackPanelOpened;
  const browserOpenState: BrowserOpenState = trackPanelOpened
    ? BrowserOpenState.SEMI_EXPANDED
    : BrowserOpenState.EXPANDED;

  return {
    ...state,
    browserOpenState,
    trackPanelOpened
  };
};

export const drawerState = (state: BrowserState, drawerOpened: boolean) => {
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
