import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import * as browserActions from './browserActions';
import {
  BrowserState,
  defaultBrowserState,
  trackPanelState,
  drawerState,
  ExampleObjects,
  defaultExampleObjects,
  ObjectState,
  defaultObjectState
} from './browserState';

function browserInfo(
  state: BrowserState = defaultBrowserState,
  action: ActionType<typeof browserActions>
): BrowserState {
  switch (action.type) {
    case getType(browserActions.updateBrowserActivated):
      return { ...state, browserActivated: action.payload };
    case getType(browserActions.toggleTrackPanel):
      return trackPanelState(state, action.payload);
    case getType(browserActions.changeDrawerView):
      return {
        ...state,
        drawerView: action.payload
      };
    case getType(browserActions.toggleDrawer):
      return drawerState(state, action.payload);
    case getType(browserActions.toggleBrowserNav):
      return { ...state, browserNavOpened: !state.browserNavOpened };
    case getType(browserActions.updateBrowserNavStates):
      return { ...state, browserNavStates: action.payload };
    case getType(browserActions.updateChrLocation):
      return { ...state, chrLocation: action.payload };
    case getType(browserActions.updateDefaultChrLocation):
      return {
        ...state,
        chrLocation: action.payload,
        defaultChrLocation: action.payload
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
    case getType(browserActions.toggleGenomeSelector):
      return { ...state, genomeSelectorActive: action.payload };
    case getType(browserActions.selectBrowserTab):
      return { ...state, selectedBrowserTab: action.payload };
    default:
      return state;
  }
}

function exampleObjects(
  state: ExampleObjects = defaultExampleObjects,
  action: ActionType<typeof browserActions>
): ExampleObjects {
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

export default combineReducers({
  browserInfo,
  exampleObjects,
  object
});
