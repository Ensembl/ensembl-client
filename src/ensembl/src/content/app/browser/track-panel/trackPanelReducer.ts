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

import { ActionType, getType } from 'typesafe-actions';
import pickBy from 'lodash/pickBy';

import {
  getInitialTrackPanelState,
  getInitialTrackPanelStateForGenome,
  getPersistentTrackPanelStateForGenome,
  TrackPanelState
} from './trackPanelState';
import * as browserActions from 'src/content/app/browser/browserActions';
import * as trackPanelActions from './trackPanelActions';

export default function trackPanel(
  state: TrackPanelState = getInitialTrackPanelState(),
  action:
    | ActionType<typeof trackPanelActions>
    | ActionType<typeof browserActions>
): TrackPanelState {
  switch (action.type) {
    case getType(browserActions.setDataFromUrl):
      const { activeGenomeId } = action.payload;
      const newTrackPanelStateForGenome = state[activeGenomeId]
        ? {
            ...state[activeGenomeId],
            ...getPersistentTrackPanelStateForGenome(activeGenomeId)
          }
        : {
            ...getInitialTrackPanelStateForGenome(activeGenomeId)
          };

      return {
        ...state,
        [activeGenomeId]: newTrackPanelStateForGenome
      };
    case getType(trackPanelActions.updateTrackPanelForGenome):
      return {
        ...state,
        [action.payload.activeGenomeId]: {
          ...state[action.payload.activeGenomeId],
          ...action.payload.data
        }
      };
    case getType(browserActions.deleteGenome):
      const newState = pickBy(state, (value, key) => key !== action.payload);
      return newState;
    default:
      return state;
  }
}
