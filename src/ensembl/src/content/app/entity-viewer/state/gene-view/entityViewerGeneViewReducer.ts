import { ActionType, getType } from 'typesafe-actions';
import merge from 'lodash/merge';
import get from 'lodash/get';

import {
  defaultEntityViewerGeneViewObjectState,
  initialEntityViewerGeneViewState,
  EntityViewerGeneViewState
} from './entityViewerGeneViewState';
import * as actions from './entityViewerGeneViewActions';

export default function entityViewerGeneViewReducer(
  state: EntityViewerGeneViewState = initialEntityViewerGeneViewState,
  action: ActionType<typeof actions>
) {
  switch (action.type) {
    case getType(actions.updateActiveGeneViewObjectState):
      const { activeGenomeId, activeObjectId, fragment } = action.payload;
      const oldStateFragment = get(
        state,
        `${activeGenomeId}.${activeObjectId}`,
        defaultEntityViewerGeneViewObjectState
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
