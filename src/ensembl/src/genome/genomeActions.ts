import { createAsyncAction } from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { Action, ActionCreator } from 'redux';
import apiService from 'src/services/api-service';
import { RootState } from 'src/store';
import {
  GenomeInfoData,
  GenomeTrackCategories,
  GenomeKaryotypeItem
} from './genomeTypes';

import { fetchExampleEnsObjects } from 'src/ens-object/ensObjectActions';

import {
  getGenomeInfoById,
  getGenomeTrackCategories,
  getGenomeKaryotype
} from 'src/genome/genomeSelectors';
import { ensureSpeciesIsCommitted } from 'src/content/app/species-selector/state/speciesSelectorActions';
import { getBrowserActiveGenomeId } from 'src/content/app/browser/browserSelectors';

export const fetchGenomeInfoAsyncActions = createAsyncAction(
  'genome/fetch_genome_info_request',
  'genome/fetch_genome_info_success',
  'genome/fetch_genome_info_failure'
)<undefined, GenomeInfoData, Error>();

export const fetchGenomeData: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => async (dispatch) => {
  await Promise.all([
    dispatch(fetchGenomeInfo(genomeId)),
    dispatch(fetchGenomeTrackCategories(genomeId)),
    dispatch(fetchGenomeKaryotype(genomeId))
  ]);

  dispatch(ensureSpeciesIsCommitted(genomeId));

  dispatch(fetchExampleEnsObjects(genomeId));
};

export const fetchGenomeInfo: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => async (dispatch, getState: () => RootState) => {
  const state = getState();
  const genomeInfo = getGenomeInfoById(state, genomeId);
  if (genomeInfo) {
    return; // nothing to do
  }
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

export const fetchGenomeTrackCategoriesAsyncActions = createAsyncAction(
  'genome/fetch_genome_track_categories_request',
  'genome/fetch_genome_track_categories_success',
  'genome/fetch_genome_track_categories_failure'
)<string, GenomeTrackCategories, Error>();

export const fetchGenomeTrackCategories: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => async (dispatch, getState: () => RootState) => {
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

export const fetchGenomeKaryotypeAsyncActions = createAsyncAction(
  'genome/fetch_genome_karyotype_request',
  'genome/fetch_genome_karyotype_success',
  'genome/fetch_genome_karyotype_failure'
)<string, any, Error>();

export const fetchGenomeKaryotype: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => async (dispatch, getState: () => RootState) => {
  try {
    const currentGenomeKaryotype:
      | GenomeKaryotypeItem[]
      | null = getGenomeKaryotype(getState());

    if (currentGenomeKaryotype) {
      return;
    }

    dispatch(fetchGenomeKaryotypeAsyncActions.request(genomeId));

    const url = `/api/genome/karyotype?genome_id=${genomeId}`;
    const response = await apiService.fetch(url);

    dispatch(
      fetchGenomeKaryotypeAsyncActions.success({
        data: response,
        activeGenomeId: getBrowserActiveGenomeId(getState())
      })
    );
  } catch (error) {
    dispatch(fetchGenomeKaryotypeAsyncActions.failure(error));
  }
};
