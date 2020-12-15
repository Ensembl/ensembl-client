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
import merge from 'lodash/merge';
import mergeWith from 'lodash/mergeWith';
import get from 'lodash/get';

import * as actions from './entityViewerSidebarActions';

import {
  buildInitialStateForGenome,
  EntityViewerSidebarState
} from './entityViewerSidebarState';
import JSONValue from 'src/shared/types/JSON';

export default function entityViewerSidebarReducer(
  state: EntityViewerSidebarState = {},
  action: ActionType<typeof actions>
) {
  switch (action.type) {
    case getType(actions.setSidebarInitialStateForGenome):
      return state[action.payload]
        ? state
        : {
            ...state,
            ...buildInitialStateForGenome(action.payload)
          };
    case getType(actions.updateGenomeState): {
      const oldStateFragment = get(state, `${action.payload.genomeId}`);
      const updatedStateFragment = merge(
        {},
        oldStateFragment,
        action.payload.fragment
      );

      return {
        ...state,
        [action.payload.genomeId]: updatedStateFragment
      };
    }
    case getType(actions.updateEntityState): {
      const { genomeId } = action.payload;
      const oldStateFragment =
        get(state, `${genomeId}`) || buildInitialStateForGenome(genomeId);
      const updatedStateFragment = merge({}, oldStateFragment, {
        entities: {
          [action.payload.entityId]: { payload: action.payload.fragment }
        }
      });

      return {
        ...state,
        [action.payload.genomeId]: updatedStateFragment
      };
    }
    case getType(actions.updateEntityUIState): {
      const oldStateFragment = get(state, `${action.payload.genomeId}`);

      // We need to overwrite the arrays instead of merging them so that it is easier to remove entries
      const overwriteArray = (objValue: JSONValue, srcValue: JSONValue) => {
        if (Array.isArray(objValue)) {
          return srcValue;
        }
      };

      const updatedStateFragment = mergeWith(
        {},
        oldStateFragment,
        {
          entities: {
            [action.payload.entityId]: { uIState: action.payload.fragment }
          }
        },
        overwriteArray
      );

      return {
        ...state,
        [action.payload.genomeId]: updatedStateFragment
      };
    }
    default:
      return state;
  }
}
