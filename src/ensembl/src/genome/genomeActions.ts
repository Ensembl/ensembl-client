import { createAsyncAction } from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { Action, ActionCreator, Dispatch } from 'redux';

import apiService from 'src/services/api-service';
import { RootState } from 'src/store';
import { GenomeInfoData, GenomeTrackCategoriesResponse } from './genomeTypes';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import { getGenomeInfo } from 'src/genome/genomeSelectors';

export const fetchGenomeInfoAsyncActions = createAsyncAction(
  'genome/fetch_genome_info_request',
  'genome/fetch_genome_info_success',
  'genome/fetch_genome_info_failure'
)<undefined, GenomeInfoData, Error>();

export const fetchGenomeInfo: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => (dispatch: Dispatch, getState: () => RootState) => {
  try {
    const genomeInfo: GenomeInfoData = getGenomeInfo(getState());

    const committedSpecies = getCommittedSpecies(getState());

    committedSpecies.map(async (species) => {
      if (!genomeInfo[species.genome_id]) {
        dispatch(fetchGenomeInfoAsyncActions.request());

        const url = `/api/genome/info?genome_id=${species.genome_id}`;
        const response = await apiService.fetch(url);

        dispatch(
          fetchGenomeInfoAsyncActions.success({
            [species.genome_id]: response.genome_info[0]
          })
        );
      }
    });
  } catch (error) {
    dispatch(fetchGenomeInfoAsyncActions.failure(error));
  }
};

export const fetchGenomeTrackCategoriesAsyncActions = createAsyncAction(
  'genome/fetch_genome_track_categories_request',
  'genome/fetch_genome_track_categories_success',
  'genome/fetch_genome_track_categories_failure'
)<string, GenomeTrackCategoriesResponse, Error>();

// TODO: switch to using APIs when available
export const fetchGenomeTrackCategories: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchGenomeTrackCategoriesAsyncActions.request(genomeId));

    let genomeTrackCategoriesResponse: GenomeTrackCategoriesResponse = {
      genome_id: '',
      track_categories: []
    };

    const url = `/api/genome/track_categories?genome_id=${genomeId}`;
    const response = await apiService.fetch(url);

    genomeTrackCategoriesResponse.track_categories = response.track_categories;
    genomeTrackCategoriesResponse.genome_id = genomeId;

    dispatch(
      fetchGenomeTrackCategoriesAsyncActions.success(response.track_categories)
    );
  } catch (error) {
    dispatch(fetchGenomeTrackCategoriesAsyncActions.failure(error));
  }
};
