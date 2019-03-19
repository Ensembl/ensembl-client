import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import * as browserActions from './browserActions';
import {
  BrowserState,
  defaultBrowserState,
  ExampleObjectState,
  defaultExampleObjectState,
  ObjectState,
  defaultObjectState,
  BrowserOpenState,
  TrackPanelState,
  defaultTrackPanelState,
  DrawerState,
  defaultDrawerState,
  BrowserLocationState,
  defaultBrowserLocationState,
  BrowserNavState,
  defaultBrowserNavState,
  TrackConfigState,
  defaultTrackConfigState
} from './browserState';

function browserInfo(
  state: BrowserState = defaultBrowserState,
  action: ActionType<typeof browserActions>
): BrowserState {
  switch (action.type) {
    case getType(browserActions.updateBrowserActivated):
      return { ...state, browserActivated: action.payload };
    case getType(browserActions.toggleTrackPanel):
      return {
        ...state,
        browserOpenState: action.payload
          ? BrowserOpenState.SEMI_EXPANDED
          : BrowserOpenState.EXPANDED
      };
    case getType(browserActions.toggleDrawer):
      return {
        ...state,
        browserOpenState: action.payload
          ? BrowserOpenState.COLLAPSED
          : BrowserOpenState.SEMI_EXPANDED
      };
    default:
      return state;
  }
}

export function browserNav(
  state: BrowserNavState = defaultBrowserNavState,
  action: ActionType<typeof browserActions>
) {
  switch (action.type) {
    case getType(browserActions.toggleBrowserNav):
      return { ...state, browserNavOpened: !state.browserNavOpened };
    case getType(browserActions.updateBrowserNavStates):
      return { ...state, browserNavStates: action.payload };
    default:
      return state;
  }
}

export function browserLocation(
  state: BrowserLocationState = defaultBrowserLocationState,
  action: ActionType<typeof browserActions>
) {
  switch (action.type) {
    case getType(browserActions.updateChrLocation):
      return { ...state, chrLocation: action.payload };
    case getType(browserActions.updateDefaultChrLocation):
      return {
        ...state,
        chrLocation: action.payload,
        defaultChrLocation: action.payload
      };
    case getType(browserActions.toggleGenomeSelector):
      return { ...state, genomeSelectorActive: action.payload };
    default:
      return state;
  }
}

export function trackConfig(
  state: TrackConfigState = defaultTrackConfigState,
  action: ActionType<typeof browserActions>
) {
  switch (action.type) {
    case getType(browserActions.updateCogList):
      return { ...state, browserCogList: action.payload };
    case getType(browserActions.updateCogTrackList):
      return { ...state, browserCogTrackList: action.payload };
    case getType(browserActions.updateSelectedCog):
      return { ...state, selectedCog: action.payload };
    case getType(browserActions.updateApplyToAll):
      return { ...state, applyToAll: action.payload };
    case getType(browserActions.updateTrackConfigNames):
      return {
        ...state,
        trackConfigNames: {
          ...state.trackConfigNames,
          [action.payload[0]]: action.payload[1]
        }
      };
    case getType(browserActions.updateTrackConfigLabel):
      return {
        ...state,
        trackConfigLabel: {
          ...state.trackConfigLabel,
          [action.payload[0]]: action.payload[1]
        }
      };
    default:
      return state;
  }
}

export function trackPanel(
  state: TrackPanelState = defaultTrackPanelState,
  action: ActionType<typeof browserActions>
): TrackPanelState {
  switch (action.type) {
    case getType(browserActions.toggleTrackPanel):
      const trackPanelOpened =
        action.payload === undefined ? !state.trackPanelOpened : action.payload;

      return {
        ...state,
        trackPanelOpened
      };
    case getType(browserActions.openTrackPanelModal):
      return {
        ...state,
        trackPanelModalOpened: true,
        trackPanelModalView: action.payload
      };
    case getType(browserActions.closeTrackPanelModal):
      return {
        ...state,
        trackPanelModalOpened: false,
        trackPanelModalView: ''
      };
    case getType(browserActions.selectBrowserTab):
      return {
        ...state,
        selectedBrowserTab: action.payload,
        trackPanelModalOpened: false,
        trackPanelModalView: ''
      };
    default:
      return state;
  }
}

export function drawer(
  state: DrawerState = defaultDrawerState,
  action: ActionType<typeof browserActions>
): DrawerState {
  switch (action.type) {
    case getType(browserActions.changeDrawerView):
      return {
        ...state,
        drawerView: action.payload
      };
    case getType(browserActions.toggleDrawer):
      return {
        ...state,
        drawerOpened: action.payload,
        drawerView: action.payload ? state.drawerView : ''
      };
    default:
      return state;
  }
}

function object(
  state: ObjectState = defaultObjectState,
  action: ActionType<typeof browserActions>
): ObjectState {
  switch (action.type) {
    case getType(browserActions.fetchObject.failure):
      return { ...state, objectFetchFailed: true };
    case getType(browserActions.fetchObject.request):
      return {
        ...state,
        objectFetchFailed: false,
        objectFetching: true
      };
    case getType(browserActions.fetchObject.success):
      type Payload = {
        object_info: {};
        track_categories: [];
      };

      const json = action.payload as Payload;

      return {
        ...state,
        objectFetchFailed: false,
        objectFetching: false,
        objectInfo: json.object_info,
        trackCategories: json.track_categories
      };
    default:
      return state;
  }
}

function exampleObjects(
  state: ExampleObjectState = defaultExampleObjectState,
  action: ActionType<typeof browserActions>
): ExampleObjectState {
  switch (action.type) {
    case getType(browserActions.fetchExampleObjects.failure):
      return { ...state, exampleObjectsFetchFailed: true };
    case getType(browserActions.fetchExampleObjects.request):
      return {
        ...state,
        exampleObjectsFetchFailed: false,
        exampleObjectsFetching: true
      };
    case getType(browserActions.fetchExampleObjects.success):
      type Payload = {
        examples: {};
      };

      const json = action.payload as Payload;

      return {
        ...state,
        exampleObjectsFetchFailed: false,
        exampleObjectsFetching: false,
        examples: json.examples
      };
    default:
      return state;
  }
}

export default combineReducers({
  browserInfo,
  browserLocation,
  browserNav,
  drawer,
  exampleObjects,
  object,
  trackConfig,
  trackPanel
});
