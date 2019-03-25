import { ActionType, getType } from 'typesafe-actions';
import { combineReducers } from 'redux';

import * as objectActions from './objectActions';
import {
  ExampleObjectState,
  defaultExampleObjectState,
  ObjectInfoState,
  defaultObjectInfoState
} from './objectState';

function objectInfo(
  state: ObjectInfoState = defaultObjectInfoState,
  action: ActionType<typeof objectActions>
): ObjectInfoState {
  switch (action.type) {
    case getType(objectActions.fetchObject.failure):
      return { ...state, objectFetchFailed: true };
    case getType(objectActions.fetchObject.request):
      return {
        ...state,
        objectFetchFailed: false,
        objectFetching: true
      };
    case getType(objectActions.fetchObject.success):
      type Payload = {
        object_info: {};
        track_categories: [];
      };

      const json = action.payload as Payload;

      return {
        ...state,
        object: json.object_info,
        objectFetchFailed: false,
        objectFetching: false,
        trackCategories: json.track_categories
      };
    default:
      return state;
  }
}

function exampleObjects(
  state: ExampleObjectState = defaultExampleObjectState,
  action: ActionType<typeof objectActions>
): ExampleObjectState {
  switch (action.type) {
    case getType(objectActions.fetchExampleObjects.failure):
      return { ...state, exampleObjectsFetchFailed: true };
    case getType(objectActions.fetchExampleObjects.request):
      return {
        ...state,
        exampleObjectsFetchFailed: false,
        exampleObjectsFetching: true
      };
    case getType(objectActions.fetchExampleObjects.success):
      type Payload = {
        examples: {};
      };

      const json = action.payload as Payload;

      return {
        ...state,
        exampleObjectsFetchFailed: false,
        exampleObjectsFetching: false,
        examples: json.examples
      };
    default:
      return state;
  }
}

export default combineReducers({
  exampleObjects,
  objectInfo
});
