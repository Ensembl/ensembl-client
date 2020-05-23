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
import { Action, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import apiService from 'src/services/api-service';

import { shouldFetch } from 'src/shared/helpers/fetchHelper';

import { GenomeInfoData } from 'src/shared/state/genome/genomeTypes';
import { getGenomeInfo } from 'src/shared/state/genome/genomeSelectors';
import {
  getEnsObjectLoadingStatus,
  getExampleEnsObjects
} from 'src/shared/state/ens-object/ensObjectSelectors';
import { TrackId } from 'src/content/app/browser/track-panel/trackPanelConfig';
import { EnsObject, EnsObjectResponse } from './ensObjectTypes';
import { RootState } from 'src/store';

export const fetchEnsObjectAsyncActions = createAsyncAction(
  'ens-object/fetch_ens_object_request',
  'ens-object/fetch_ens_object_success',
  'ens-object/fetch_ens_object_failure'
)<string, { id: string; data: EnsObject }, Error>();

export const fetchEnsObject: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (ensObjectId: string) => async (dispatch, getState: () => RootState) => {
  const state = getState();
  const ensObjectLoadingStatus = getEnsObjectLoadingStatus(state, ensObjectId);
  if (!shouldFetch(ensObjectLoadingStatus)) {
    return;
  }

  try {
    dispatch(fetchEnsObjectAsyncActions.request(ensObjectId));

    const url = `/api/object/info?object_id=${ensObjectId}`;
    const response: EnsObjectResponse = await apiService.fetch(url);

    if (response.object_type !== 'region') {
      // region objects don't have associated track lists
      const trackUrl = `/api/object/track_list?object_id=${ensObjectId}`;
      try {
        response.track = await apiService.fetch(trackUrl);
      } catch {
        // FIXME: this is a temporary solution
        response.track = builtTrackList(response);
      }
    }

    dispatch(
      fetchEnsObjectAsyncActions.success({
        id: response.object_id,
        data: response
      })
    );
  } catch (error) {
    dispatch(fetchEnsObjectAsyncActions.failure(error));
  }
};

export const fetchExampleEnsObjects: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (genomeId: string) => async (dispatch, getState: () => RootState) => {
  const state = getState();
  const genomeInfoData: GenomeInfoData = getGenomeInfo(state);
  const genomeInfo = genomeInfoData[genomeId];
  const exampleObjects = getExampleEnsObjects(state, genomeId);

  if (genomeId && genomeInfo && !exampleObjects.length) {
    genomeInfo.example_objects.forEach((exampleObjectId) => {
      dispatch(fetchEnsObject(exampleObjectId));
    });
  }
};

// FIXME: this is a temporary solution, until the backend
// fixes the api/object/track_list endpoint
const builtTrackList = (ensObject: EnsObjectResponse) => {
  return {
    additional_info: ensObject.bio_type || undefined,
    description: ensObject.description,
    ensembl_object_id: ensObject.object_id, // we don't use this field
    label: ensObject.label,
    track_id: TrackId.GENE,
    child_tracks: []
  };
};
