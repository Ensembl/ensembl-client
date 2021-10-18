/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';
import merge from 'lodash/merge';
import pickBy from 'lodash/pickBy';

import * as browserActions from './browserActions';
import {
  BrowserLocationState,
  defaultBrowserLocationState,
  BrowserNavState,
  TrackConfigState,
  defaultTrackConfigState,
  BrowserEntityState,
  defaultBrowserEntityState,
  defaultBrowserNavState
} from './browserState';
import trackPanelReducer from 'src/content/app/browser/track-panel/trackPanelReducer';

export function browserEntity(
  state: BrowserEntityState = defaultBrowserEntityState,
  action: ActionType<typeof browserActions>
): BrowserEntityState {
  switch (action.type) {
    case getType(browserActions.setActiveGenomeId): {
      return { ...state, activeGenomeId: action.payload };
    }
    case getType(browserActions.setDataFromUrl): {
      const { activeGenomeId, activeEnsObjectId } = action.payload;
      const newState = {
        ...state,
        activeGenomeId
      };
      if (activeEnsObjectId) {
        newState.activeEnsObjectIds = {
          ...newState.activeEnsObjectIds,
          [activeGenomeId]: activeEnsObjectId
        };
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
    case getType(browserActions.deleteGenome): {
      const genomeIdToRemove = action.payload;
      const activeGenomeId = state.activeGenomeId;
      if (activeGenomeId === genomeIdToRemove) {
        const newState = {
          ...state,
          activeGenomeId: null,
          activeEnsObjectIds: pickBy(
            state.activeEnsObjectIds,
            (value, key) => key !== activeGenomeId
          )
        };

        return newState;
      }
    }
    default:
      return state;
  }
}

export function browserNav(
  state: BrowserNavState = defaultBrowserNavState,
  action: ActionType<typeof browserActions>
) {
  switch (action.type) {
    case getType(browserActions.openBrowserNav):
      return {
        ...state,
        browserNavOpenState: {
          ...state.browserNavOpenState,
          [action.payload.activeGenomeId]: true
        }
      };
    case getType(browserActions.closeBrowserNav):
      return {
        ...state,
        browserNavOpenState: {
          ...state.browserNavOpenState,
          [action.payload.activeGenomeId]: false
        }
      };
    case getType(browserActions.updateBrowserNavIconStates):
      return {
        ...state,
        browserNavIconStates: action.payload.navStates
      };
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
    case getType(browserActions.deleteGenome):
      const genomeId = action.payload;

      const newState = {
        ...state,
        chrLocations: pickBy(
          state.chrLocations,
          (value, key) => key !== genomeId
        ),
        actualChrLocations: pickBy(
          state.chrLocations,
          (value, key) => key !== genomeId
        )
      };
      return newState;

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
  browserEntity,
  browserLocation,
  browserNav,
  trackConfig,
  trackPanel: trackPanelReducer
});
