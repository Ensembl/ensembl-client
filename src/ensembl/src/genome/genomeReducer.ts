import { ActionType, getType } from 'typesafe-actions';
import { combineReducers } from 'redux';

import * as genomeActions from './genomeActions';

import {
  GenomeInfoState,
  defaultGenomeInfoState,
  GenomeTrackCategoriesState,
  defaultGenomeTrackCategoriesState,
  GenomeExampleEnsObjectsState,
  defaultGenomeExampleEnsObjectsState
} from './genomeState';
import { GenomeInfo } from './genomeTypes';
import { EnsObject, EnsObjectResponse } from 'src/ens-object/ensObjectTypes';
import {} from 'tests/data/genome/genome-track-categories';

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
      const genomeInfoData = action.payload.genome_info[0] as GenomeInfo;

      return {
        ...state,
        genomeInfoData,
        genomeInfoFetchFailed: false,
        genomeInfoFetching: false
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
        genomeTrackCategoriesData: action.payload.track_categories,
        genomeTrackCategoriesFetchFailed: false,
        genomeTrackCategoriesFetching: false
      };
    default:
      return state;
  }
}

function genomeExampleEnsObjects(
  state: GenomeExampleEnsObjectsState = defaultGenomeExampleEnsObjectsState,
  action: ActionType<typeof genomeActions>
): GenomeExampleEnsObjectsState {
  switch (action.type) {
    case getType(
      genomeActions.fetchGenomeExampleEnsObjectsAsyncActions.failure
    ):
      return {
        ...state,
        genomeExampleEnsObjectsFetchFailed: true,
        genomeExampleEnsObjectsFetching: false
      };
    case getType(
      genomeActions.fetchGenomeExampleEnsObjectsAsyncActions.request
    ):
      return {
        ...state,
        genomeExampleEnsObjectsFetchFailed: false,
        genomeExampleEnsObjectsFetching: true
      };
    case getType(
      genomeActions.fetchGenomeExampleEnsObjectsAsyncActions.success
    ):
      return {
        ...state,
        genomeExampleEnsObjectsData: action.payload.map(
          (response: EnsObjectResponse) => response.ensembl_object as EnsObject
        ),
        genomeExampleEnsObjectsFetchFailed: false,
        genomeExampleEnsObjectsFetching: false
      };
    default:
      return state;
  }
}

export default combineReducers({
  genomeInfo,
  genomeTrackCategories,
  genomeExampleEnsObjects
});
