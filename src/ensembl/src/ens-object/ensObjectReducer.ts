import { ActionType, getType } from 'typesafe-actions';
import { combineReducers } from 'redux';

import * as objectActions from './ensObjectActions';
import {
  CurrentEnsObjectState,
  defaultCurrentEnsObjectState,
  ExampleEnsObjectState,
  defaultExampleEnsObjectState
} from './ensObjectState';

function currentEnsObject(
  state: CurrentEnsObjectState = defaultCurrentEnsObjectState,
  action: ActionType<typeof objectActions>
): CurrentEnsObjectState {
  switch (action.type) {
    case getType(objectActions.fetchEnsObject.failure):
      return { ...state, ensObjectFetchFailed: true };
    case getType(objectActions.fetchEnsObject.request):
      return {
        ...state,
        ensObjectFetchFailed: false,
        ensObjectFetching: true
      };
    case getType(objectActions.fetchEnsObject.success):
      return {
        ...state,
        ensObjectInfo: action.payload.object_info,
        ensObjectFetchFailed: false,
        ensObjectFetching: false,
        trackCategories: action.payload.track_categories
      };
    default:
      return state;
  }
}

function exampleEnsObjects(
  state: ExampleEnsObjectState = defaultExampleEnsObjectState,
  action: ActionType<typeof objectActions>
): ExampleEnsObjectState {
  switch (action.type) {
    case getType(objectActions.fetchExampleEnsObjects.failure):
      return { ...state, exampleEnsObjectsFetchFailed: true };
    case getType(objectActions.fetchExampleEnsObjects.request):
      return {
        ...state,
        exampleEnsObjectsFetchFailed: false,
        exampleEnsObjectsFetching: true
      };
    case getType(objectActions.fetchExampleEnsObjects.success):
      type Payload = {
        examples: {};
      };

      const json = action.payload as Payload;

      return {
        ...state,
        exampleEnsObjectsFetchFailed: false,
        exampleEnsObjectsFetching: false,
        examples: json.examples
      };
    default:
      return state;
  }
}

export default combineReducers({
  currentEnsObject,
  exampleEnsObjects
});
