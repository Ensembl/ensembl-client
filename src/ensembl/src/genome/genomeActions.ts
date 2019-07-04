import { createAsyncAction } from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { Action, ActionCreator, Dispatch } from 'redux';
import queryString from 'query-string';

import apiService from 'src/services/api-service';
import { RootState } from 'src/store';
import {
  GenomeInfoData,
  GenomeInfo,
  GenomeTrackCategories
} from './genomeTypes';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import {
  getGenomeInfo,
  getGenomeTrackCategories
} from 'src/genome/genomeSelectors';

export const fetchGenomeInfoAsyncActions = createAsyncAction(
  'genome/fetch_genome_info_request',
  'genome/fetch_genome_info_success',
  'genome/fetch_genome_info_failure'
)<undefined, GenomeInfoData, Error>();

export const fetchGenomeInfo: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchGenomeInfoAsyncActions.request());
    const url = `/api/genome/info?genome_id=${genomeId}`;
    const response = await apiService.fetch(url);

    dispatch(
      fetchGenomeInfoAsyncActions.success({
        [genomeId]: response.genome_info[0] // FIXME: Why the response is an array instead of an object keyed by genomeId?
      })
    );
  } catch (error) {
    dispatch(fetchGenomeInfoAsyncActions.failure(error));
  }
};

export const fetchAllGenomesInfo: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => async (dispatch: Dispatch, getState: () => RootState) => {
  try {
    dispatch(fetchGenomeInfoAsyncActions.request());
    const genomeIds = getCommittedSpecies(getState()).map(
      ({ genome_id }) => genome_id
    );
    const query = queryString.stringify({ genome_id: genomeIds });

    const url = `/api/genome/info?${query}`;
    const response = await apiService.fetch(url);
    const genomeInfo = response.genome_info.reduce(
      (result: GenomeInfoData, genome: GenomeInfo) => ({
        ...result,
        [genome.genome_id]: genome
      }),
      {}
    );

    dispatch(fetchGenomeInfoAsyncActions.success(genomeInfo));
  } catch (error) {
    dispatch(fetchGenomeInfoAsyncActions.failure(error));
  }
};

export const fetchGenomeTrackCategoriesAsyncActions = createAsyncAction(
  'genome/fetch_genome_track_categories_request',
  'genome/fetch_genome_track_categories_success',
  'genome/fetch_genome_track_categories_failure'
)<string, GenomeTrackCategories, Error>();

export const fetchGenomeTrackCategories: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => async (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  try {
    const currentGenomeTrackCategories: GenomeTrackCategories = getGenomeTrackCategories(
      getState()
    );

    if (currentGenomeTrackCategories[genomeId]) {
      return;
    }

    const updatedGenomeTrackCategories: GenomeTrackCategories = {
      ...currentGenomeTrackCategories
    };

    dispatch(fetchGenomeTrackCategoriesAsyncActions.request(genomeId));

    const url = `/api/genome/track_categories?genome_id=${genomeId}`;
    const response = await apiService.fetch(url);
    updatedGenomeTrackCategories[genomeId] = response.track_categories;

    dispatch(
      fetchGenomeTrackCategoriesAsyncActions.success(
        updatedGenomeTrackCategories
      )
    );
  } catch (error) {
    dispatch(fetchGenomeTrackCategoriesAsyncActions.failure(error));
  }
};
