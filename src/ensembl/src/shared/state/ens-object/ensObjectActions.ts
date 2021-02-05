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
import { Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import apiService from 'src/services/api-service';

import { shouldFetch } from 'src/shared/helpers/fetchHelper';
import {
  parseEnsObjectId,
  buildEnsObjectId,
  buildRegionObject,
  EnsObjectIdConstituents
} from './ensObjectHelpers';

import { getGenomeExampleFocusObjects } from 'src/shared/state/genome/genomeSelectors';
import { getEnsObjectLoadingStatus } from 'src/shared/state/ens-object/ensObjectSelectors';

import { TrackId } from 'src/content/app/browser/track-panel/trackPanelConfig';
import { EnsObject, EnsObjectResponse } from './ensObjectTypes';
import { RootState } from 'src/store';

export const fetchEnsObjectAsyncActions = createAsyncAction(
  'ens-object/fetch_ens_object_request',
  'ens-object/fetch_ens_object_success',
  'ens-object/fetch_ens_object_failure'
)<string, { id: string; data: EnsObject }, Error>();

export const fetchEnsObject = (
  payload: string | EnsObjectIdConstituents
): ThunkAction<void, any, null, Action<string>> => async (
  dispatch,
  getState: () => RootState
) => {
  if (typeof payload === 'string') {
    payload = parseEnsObjectId(payload);
  }
  const state = getState();
  const ensObjectId = buildEnsObjectId(payload);
  const ensObjectLoadingStatus = getEnsObjectLoadingStatus(state, ensObjectId);
  if (!shouldFetch(ensObjectLoadingStatus)) {
    return;
  }

  if (payload.type === 'region') {
    const regionObject = buildRegionObject(payload);
    dispatch(
      fetchEnsObjectAsyncActions.success({
        id: ensObjectId,
        data: regionObject
      })
    );
    return;
  }

  try {
    dispatch(fetchEnsObjectAsyncActions.request(ensObjectId));
    const { genomeId, objectId, type } = payload;

    const objectInfoUrl = `/api/genomesearch/object/info?genome_id=${genomeId}&type=${type}&stable_id=${objectId}`;
    const objectTracksUrl = `/api/genomesearch/object/track_list?genome_id=${genomeId}&type=${type}&stable_id=${objectId}`;
    const response: EnsObjectResponse = await apiService.fetch(objectInfoUrl);
    response.object_id = buildEnsObjectId(payload);

    try {
      response.track = await apiService.fetch(objectTracksUrl);
    } catch {
      // FIXME: this is a temporary solution
      response.track = builtTrackList(response);
    }

    dispatch(
      fetchEnsObjectAsyncActions.success({
        id: ensObjectId,
        data: response
      })
    );
  } catch (error) {
    dispatch(fetchEnsObjectAsyncActions.failure(error));
  }
};

export const fetchExampleEnsObjects = (
  genomeId: string
): ThunkAction<void, any, null, Action<string>> => async (
  dispatch,
  getState: () => RootState
) => {
  const state = getState();
  const exampleFocusObjects = getGenomeExampleFocusObjects(state, genomeId);

  exampleFocusObjects.forEach(({ id, type }) => {
    dispatch(fetchEnsObject({ genomeId, type, objectId: id }));
  });
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
    child_tracks: [],
    stable_id: ensObject.stable_id
  };
};
