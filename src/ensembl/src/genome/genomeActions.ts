import { createAsyncAction } from 'typesafe-actions';
import { ThunkAction } from 'redux-thunk';
import { Action, ActionCreator } from 'redux';
import find from 'lodash/find';
import apiService from 'src/services/api-service';
import { RootState } from 'src/store';
import {
  GenomeInfoData,
  GenomeInfo,
  GenomeTrackCategories
} from './genomeTypes';
import omit from 'lodash/omit';

import { fetchExampleEnsObjects } from 'src/ens-object/ensObjectActions';
import { getEnabledCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';
import {
  getGenomeInfoById,
  getGenomeTrackCategories
} from 'src/genome/genomeSelectors';
import { updateCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorActions';

export const fetchGenomeInfoAsyncActions = createAsyncAction(
  'genome/fetch_genome_info_request',
  'genome/fetch_genome_info_success',
  'genome/fetch_genome_info_failure'
)<undefined, GenomeInfoData, Error>();

export const fetchGenomeData: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => async (dispatch, getState: () => RootState) => {
  await Promise.all([
    dispatch(fetchGenomeInfo(genomeId)),
    dispatch(fetchGenomeTrackCategories(genomeId))
  ]);

  const state = getState();
  const committedSpecies: CommittedItem[] = getEnabledCommittedSpecies(state);
  const genomeInfo: GenomeInfo | null = getGenomeInfoById(state, genomeId);
  if (
    genomeInfo &&
    !find(
      committedSpecies,
      (species: CommittedItem) => species.genome_id === genomeId
    )
  ) {
    const newCommittedSpecies = [
      ...committedSpecies,
      { ...omit(genomeInfo, ['example_objects']), isEnabled: true }
    ];

    dispatch(updateCommittedSpecies(newCommittedSpecies));
  }

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
