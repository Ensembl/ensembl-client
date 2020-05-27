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

import * as headerActions from './headerActions';

import { HeaderState, defaultState } from './headerState';

export default (
  state: HeaderState = defaultState,
  action: ActionType<typeof headerActions>
): HeaderState => {
  switch (action.type) {
    case getType(headerActions.toggleAccount):
      return { ...state, accountExpanded: !state.accountExpanded };
    case getType(headerActions.toggleLaunchbar):
      return { ...state, launchbarExpanded: !state.launchbarExpanded };
    case getType(headerActions.changeCurrentApp):
      return { ...state, currentApp: action.payload };
    default:
      return state;
  }
};
