import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';
import merge from 'lodash/merge';
import pickBy from 'lodash/pickBy';

import { RootAction } from 'src/objects';
import * as browserActions from './browserActions';
import {
  BrowserState,
  defaultBrowserState,
  BrowserLocationState,
  defaultBrowserLocationState,
  BrowserNavState,
  defaultBrowserNavState,
  TrackConfigState,
  defaultTrackConfigState,
  BrowserEntityState,
  defaultBrowserEntityState
} from './browserState';
import trackPanelReducer from 'src/content/app/browser/track-panel/trackPanelReducer';

import { LoadingState } from 'src/shared/types/loading-state';

export function browserInfo(
  state: BrowserState = defaultBrowserState,
  action: ActionType<RootAction>
): BrowserState {
  switch (action.type) {
    case getType(browserActions.updateBrowserActivated):
      return { ...state, browserActivated: action.payload };
    default:
      return state;
  }
}

export function browserEntity(
  state: BrowserEntityState = defaultBrowserEntityState,
  action: ActionType<typeof browserActions>
): BrowserEntityState {
  switch (action.type) {
    case getType(browserActions.setDataFromUrl): {
      const { activeGenomeId, activeEnsObjectId } = action.payload;
      const newState = {
        ...state,
        activeGenomeId
      };
      if (activeEnsObjectId) {
        newState.activeEnsObjectIds[activeGenomeId] = activeEnsObjectId;
      }
      return newState;
    }
    case getType(browserActions.updateBrowserActiveEnsObjectIds):
      return { ...state, activeEnsObjectIds: action.payload };
    case getType(browserActions.updateTrackStates):
      return {
        ...state,
        trackStates: merge({}, state.trackStates, action.payload)
      };
    case getType(browserActions.updateMessageCounter):
      return { ...state, messageCounter: action.payload };
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
    case getType(browserActions.setDataFromUrl): {
      const { activeGenomeId, chrLocation } = action.payload;
      if (chrLocation) {
        return {
          ...state,
          chrLocations: {
            ...state.chrLocations,
            [activeGenomeId]: chrLocation
          }
        };
      } else {
        return {
          ...state,
          chLocations: pickBy(
            state.chrLocations,
            (value, key) => key !== activeGenomeId
          )
        };
      }
    }
    case getType(browserActions.updateChrLocation):
      return {
        ...state,
        chrLocations: {
          ...state.chrLocations,
          ...action.payload
        }
      };
    case getType(browserActions.updateActualChrLocation):
      return {
        ...state,
        actualChrLocations: {
          ...state.actualChrLocations,
          ...action.payload
        }
      };
    case getType(browserActions.toggleRegionEditorActive):
      return { ...state, regionEditorActive: action.payload };
    case getType(browserActions.toggleRegionFieldActive):
      return { ...state, regionFieldActive: action.payload };
    case getType(browserActions.updateDefaultPositionFlag):
      return { ...state, isObjectInDefaultPosition: action.payload };
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

export default combineReducers({
  browserInfo,
  browserEntity,
  browserLocation,
  browserNav,
  trackConfig,
  trackPanel: trackPanelReducer
});
