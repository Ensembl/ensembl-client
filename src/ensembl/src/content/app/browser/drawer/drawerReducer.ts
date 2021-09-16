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

import { DrawerState, defaultDrawerState } from './drawerState';
import * as drawerActions from './drawerActions';

export default function drawer(
  state: DrawerState = defaultDrawerState,
  action: ActionType<typeof drawerActions>
): DrawerState {
  switch (action.type) {
    case getType(drawerActions.changeDrawerViewForGenome):
      return {
        ...state,
        drawerView: { ...state.drawerView, ...action.payload }
      };
    case getType(drawerActions.toggleDrawerForGenome):
      return {
        ...state,
        isDrawerOpened: { ...state.isDrawerOpened, ...action.payload }
      };
    case getType(drawerActions.setActiveDrawerTrackId):
      return {
        ...state,
        activeDrawerTrackIds: {
          ...state.activeDrawerTrackIds,
          ...action.payload
        }
      };
    case getType(drawerActions.setActiveDrawerTranscriptId):
      return {
        ...state,
        activeDrawerTranscriptIds: {
          ...state.activeDrawerTranscriptIds,
          ...action.payload
        }
      };
    default:
      return state;
  }
}
