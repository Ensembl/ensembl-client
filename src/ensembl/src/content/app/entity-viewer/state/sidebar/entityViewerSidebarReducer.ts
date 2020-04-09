import { ActionType, getType } from 'typesafe-actions';
import merge from 'lodash/merge';
import mergeWith from 'lodash/mergeWith';
import get from 'lodash/get';

import * as generalActions from '../general/entityViewerGeneralActions';
import * as actions from './entityViewerSidebarActions';

import {
  initialState,
  buildInitialStateForGenome,
  EntityViewerSidebarState
} from './entityViewerSidebarState';
import JSONValue from 'src/shared/types/JSON';

export default function entityViewerSidebarReducer(
  state: EntityViewerSidebarState = initialState,
  action: ActionType<typeof actions | typeof generalActions>
) {
  switch (action.type) {
    case getType(generalActions.setActiveGenomeId):
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
      const oldStateFragment = get(state, `${action.payload.genomeId}`);
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
