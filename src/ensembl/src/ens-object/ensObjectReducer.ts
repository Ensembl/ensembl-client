import { ActionType, getType } from 'typesafe-actions';
import { combineReducers } from 'redux';

import * as objectActions from './ensObjectActions';
import {
  ExampleEnsObjectState,
  defaultExampleEnsObjectState,
  EnsObjectInfoState,
  defaultEnsObjectInfoState
} from './ensObjectState';

function ensObjectInfo(
  state: EnsObjectInfoState = defaultEnsObjectInfoState,
  action: ActionType<typeof objectActions>
): EnsObjectInfoState {
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
      type Payload = {
        object_info: {};
        track_categories: [];
      };

      const json = action.payload as Payload;

      return {
        ...state,
        ensObject: json.object_info,
        ensObjectFetchFailed: false,
        ensObjectFetching: false,
        trackCategories: json.track_categories
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
  ensObjectInfo,
  exampleEnsObjects
});
