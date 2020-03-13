import { ActionType, getType } from 'typesafe-actions';

import {
  defaultEntityViewerGeneViewObjectState,
  initialEntityViewerGeneViewState,
  EntityViewerGeneViewState,
  EntityViewerGeneViewObjectState,
  EntityViewerGeneFunctionState,
  EntityViewerGeneRelationshipsState
} from './entityViewerGeneViewState';
import * as actions from './entityViewerGeneViewActions';

export default function entityViewerGeneViewReducer(
  state: EntityViewerGeneViewState = initialEntityViewerGeneViewState,
  action: ActionType<typeof actions>
) {
  switch (action.type) {
    case getType(actions.updateActiveGeneViewObjectState):
      return {
        ...state,
        [action.payload.activeGenomeId]: entityViewerGeneViewObjectReducer(
          state[action.payload.activeGenomeId],
          action
        )
      };
    case getType(actions.updateActiveGeneViewObjectGeneFunctionState):
      return {
        ...state,
        [action.payload.activeGenomeId]: entityViewerGeneViewObjectReducer(
          state[action.payload.activeGenomeId],
          action
        )
      };
    default:
      return state;
  }
}

function entityViewerGeneViewObjectReducer(
  state: { [activeObjectId: string]: EntityViewerGeneViewObjectState } = {},
  action: ActionType<typeof actions>
) {
  switch (action.type) {
    case getType(actions.updateActiveGeneViewObjectState):
      const oldStateFragment = state[action.payload.activeObjectId];
      const newStateFragment = {
        ...oldStateFragment,
        ...action.payload.fragment
      };
      return {
        ...state,
        [action.payload.activeObjectId]: newStateFragment
      };
    case getType(actions.updateActiveGeneViewObjectGeneFunctionState):
      return {
        ...state,
        [action.payload
          .activeObjectId]: entityViewerGeneViewObjectGeneFunctionReducer(
          state[action.payload.activeObjectId].geneFunction,
          action
        )
      };
    case getType(actions.updateActiveGeneViewObjectGeneRelationshipsState):
      return {
        ...state,
        [action.payload
          .activeObjectId]: entityViewerGeneViewObjectGeneRelationshipsReducer(
          state[action.payload.activeObjectId].geneRelationships,
          action
        )
      };
    default:
      return state;
  }
}

function entityViewerGeneViewObjectGeneFunctionReducer(
  state: EntityViewerGeneFunctionState = defaultEntityViewerGeneViewObjectState.geneFunction,
  action: ActionType<typeof actions>
) {
  switch (action.type) {
    case getType(actions.updateActiveGeneViewObjectGeneFunctionState):
      return {
        ...state,
        ...action.payload.fragment
      };
    default:
      return state;
  }
}

function entityViewerGeneViewObjectGeneRelationshipsReducer(
  state: EntityViewerGeneRelationshipsState = defaultEntityViewerGeneViewObjectState.geneRelationships,
  action: ActionType<typeof actions>
) {
  switch (action.type) {
    case getType(actions.updateActiveGeneViewObjectGeneRelationshipsState):
      return {
        ...state,
        ...action.payload.fragment
      };
    default:
      return state;
  }
}
