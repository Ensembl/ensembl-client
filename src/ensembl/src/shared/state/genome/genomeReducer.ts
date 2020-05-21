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
import { combineReducers } from 'redux';

import * as genomeActions from './genomeActions';

import {
  GenomeInfoState,
  defaultGenomeInfoState,
  GenomeTrackCategoriesState,
  defaultGenomeTrackCategoriesState,
  defaultGenomeKaryotypeState,
  GenomeKaryotypeState
} from './genomeState';
import { GenomeInfoData } from './genomeTypes';

function genomeInfo(
  state: GenomeInfoState = defaultGenomeInfoState,
  action: ActionType<typeof genomeActions>
): GenomeInfoState {
  switch (action.type) {
    case getType(genomeActions.fetchGenomeInfoAsyncActions.failure):
      return {
        ...state,
        genomeInfoFetchFailed: true,
        genomeInfoFetching: false
      };
    case getType(genomeActions.fetchGenomeInfoAsyncActions.request):
      return {
        ...state,
        genomeInfoFetchFailed: false,
        genomeInfoFetching: true
      };
    case getType(genomeActions.fetchGenomeInfoAsyncActions.success):
      return {
        ...state,
        genomeInfoData: genomeInfoData(state.genomeInfoData, action),
        genomeInfoFetchFailed: false,
        genomeInfoFetching: false
      };
    default:
      return state;
  }
}

function genomeInfoData(
  state: GenomeInfoData = {},
  action: ActionType<typeof genomeActions>
): GenomeInfoData {
  switch (action.type) {
    case getType(genomeActions.fetchGenomeInfoAsyncActions.success):
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}

function genomeTrackCategories(
  state: GenomeTrackCategoriesState = defaultGenomeTrackCategoriesState,
  action: ActionType<typeof genomeActions>
): GenomeTrackCategoriesState {
  switch (action.type) {
    case getType(genomeActions.fetchGenomeTrackCategoriesAsyncActions.failure):
      return {
        ...state,
        genomeTrackCategoriesFetchFailed: true,
        genomeTrackCategoriesFetching: false
      };
    case getType(genomeActions.fetchGenomeTrackCategoriesAsyncActions.request):
      return {
        ...state,
        genomeTrackCategoriesFetchFailed: false,
        genomeTrackCategoriesFetching: true
      };
    case getType(genomeActions.fetchGenomeTrackCategoriesAsyncActions.success):
      return {
        ...state,
        genomeTrackCategoriesData: action.payload,
        genomeTrackCategoriesFetchFailed: false,
        genomeTrackCategoriesFetching: false
      };
    default:
      return state;
  }
}

function genomeKaryotype(
  state: GenomeKaryotypeState = defaultGenomeKaryotypeState,
  action: ActionType<typeof genomeActions>
): GenomeKaryotypeState {
  switch (action.type) {
    case getType(genomeActions.fetchGenomeKaryotypeAsyncActions.failure):
      return {
        ...state,
        genomeKaryotypeFetchFailed: true,
        genomeKaryotypeFetching: false
      };
    case getType(genomeActions.fetchGenomeKaryotypeAsyncActions.request):
      return {
        ...state,
        genomeKaryotypeFetchFailed: false,
        genomeKaryotypeFetching: true
      };
    case getType(genomeActions.fetchGenomeKaryotypeAsyncActions.success):
      return {
        ...state,
        genomeKaryotypeData: {
          ...state.genomeKaryotypeData,
          [action.payload.activeGenomeId]: [...action.payload.data]
        },
        genomeKaryotypeFetchFailed: false,
        genomeKaryotypeFetching: false
      };
    default:
      return state;
  }
}

export default combineReducers({
  genomeInfo,
  genomeTrackCategories,
  genomeKaryotype
});
