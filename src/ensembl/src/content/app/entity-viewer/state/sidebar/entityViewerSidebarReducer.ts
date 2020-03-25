import { ActionType, getType } from 'typesafe-actions';
import merge from 'lodash/merge';
import get from 'lodash/get';

import * as generalActions from '../general/entityViewerGeneralActions';
import * as actions from './entityViewerSidebarActions';

import {
  initialState,
  buildInitialStateForGenome,
  EntityViewerSidebarState
} from './entityViewerSidebarState';

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
      const updatedStateFragment = merge({}, oldStateFragment, {
        entities: {
          [action.payload.entityId]: { uiState: action.payload.fragment }
        }
      });

      return {
        ...state,
        [action.payload.genomeId]: updatedStateFragment
      };
    }
    default:
      return state;
  }
}
