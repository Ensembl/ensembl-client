import { ActionType, getType } from 'typesafe-actions';
import merge from 'lodash/merge';
import get from 'lodash/get';

import {
  defaultEntityViewerGeneViewUIState,
  initialEntityViewerGeneViewState,
  EntityViewerGeneViewState
} from './entityViewerGeneViewState';
import * as actions from './entityViewerGeneViewActions';

export default function entityViewerGeneViewReducer(
  state: EntityViewerGeneViewState = initialEntityViewerGeneViewState,
  action: ActionType<typeof actions>
) {
  switch (action.type) {
    case getType(actions.updateActiveGeneViewUIState):
      const { activeGenomeId, activeObjectId, fragment } = action.payload;
      const oldStateFragment = get(
        state,
        `${activeGenomeId}.${activeObjectId}`,
        defaultEntityViewerGeneViewUIState
      );
      const updatedStateFragment = merge({}, oldStateFragment, fragment);
      return {
        ...state,
        [activeGenomeId]: {
          ...state[activeGenomeId],
          [activeObjectId]: updatedStateFragment
        }
      };
    default:
      return state;
  }
}
