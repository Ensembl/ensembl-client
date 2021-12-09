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

import { fetchExampleFocusObjects } from 'src/content/app/genome-browser/state/focus-object/focusObjectSlice';

import {
  getGenomeInfoById,
  getGenomeTrackCategories,
  getGenomeKaryotype
} from 'src/shared/state/genome/genomeSelectors';
import { ensureSpeciesIsCommitted } from 'src/content/app/species-selector/state/speciesSelectorSlice';
import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

export const fetchGenomeInfoAsyncActions = createAsyncAction(
  'genome/fetch_genome_info_request',
  'genome/fetch_genome_info_success',
  'genome/fetch_genome_info_failure'
)<undefined, GenomeInfoData, Error>();

export const fetchGenomeData =
  (genomeId: string): ThunkAction<void, any, null, Action<string>> =>
  async (dispatch) => {
    await Promise.all([
      dispatch(fetchGenomeInfo(genomeId)),
      dispatch(fetchGenomeTrackCategories(genomeId)),
      dispatch(fetchGenomeKaryotype(genomeId))
    ]);

    dispatch(ensureSpeciesIsCommitted(genomeId));

    dispatch(fetchExampleFocusObjects(genomeId));
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
    const url = `/api/genomesearch/genome/info?genome_id=${genomeId}`;
    const response = await apiService.fetch(url);

    dispatch(
      fetchGenomeInfoAsyncActions.success({
        [genomeId]: response.genome_info[0] // FIXME: Why the response is an array instead of an object keyed by genomeId?
      })
    );
  } catch (error) {
    dispatch(fetchGenomeInfoAsyncActions.failure(error as Error));
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
    const currentGenomeTrackCategories: GenomeTrackCategories =
      getGenomeTrackCategories(getState());

    if (currentGenomeTrackCategories[genomeId]) {
      return;
    }

    const updatedGenomeTrackCategories: GenomeTrackCategories = {
      ...currentGenomeTrackCategories
    };

    dispatch(fetchGenomeTrackCategoriesAsyncActions.request(genomeId));

    const url = `/api/tracks/track_categories/${genomeId}`;
    const response = await apiService.fetch(url);

    updatedGenomeTrackCategories[genomeId] = response.track_categories;
    dispatch(
      fetchGenomeTrackCategoriesAsyncActions.success(
        updatedGenomeTrackCategories
      )
    );
  } catch (error) {
    dispatch(fetchGenomeTrackCategoriesAsyncActions.failure(error as Error));
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
    const currentGenomeKaryotype: GenomeKaryotypeItem[] | null =
      getGenomeKaryotype(getState());

    if (currentGenomeKaryotype) {
      return;
    }

    dispatch(fetchGenomeKaryotypeAsyncActions.request(genomeId));

    const url = `/api/genomesearch/genome/karyotype?genome_id=${genomeId}`;
    const response = await apiService.fetch(url);

    dispatch(
      fetchGenomeKaryotypeAsyncActions.success({
        data: response,
        activeGenomeId: getBrowserActiveGenomeId(getState())
      })
    );
  } catch (error) {
    dispatch(fetchGenomeKaryotypeAsyncActions.failure(error as Error));
  }
};
