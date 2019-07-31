import { createAsyncAction } from 'typesafe-actions';
import { Action, ActionCreator } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'src/store';
import apiService from 'src/services/api-service';

import { GenomeInfoData } from 'src/genome/genomeTypes';
import { getGenomeInfo } from 'src/genome/genomeSelectors';
import { getExampleEnsObjects } from 'src/ens-object/ensObjectSelectors';
import { EnsObject, EnsObjectResponse } from './ensObjectTypes';

export const fetchEnsObjectAsyncActions = createAsyncAction(
  'ens-object/fetch_ens_object_request',
  'ens-object/fetch_ens_object_success',
  'ens-object/fetch_ens_object_failure'
)<void, { [id: string]: EnsObject }, Error>();

export const fetchEnsObject: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (ensObjectId: string) => async (dispatch) => {
  try {
    dispatch(fetchEnsObjectAsyncActions.request());
    let response: EnsObjectResponse;

    const url = `/api/object/info?object_id=${ensObjectId}`;
    response = await apiService.fetch(url);

    if (response.object_type !== 'region') {
      // region objects don't have associated track lists
      const trackUrl = `/api/object/track_list?object_id=${ensObjectId}`;
      response.track = await apiService.fetch(trackUrl);
    }

    dispatch(
      fetchEnsObjectAsyncActions.success({
        [response.object_id]: response
      })
    );
  } catch (error) {
    dispatch(fetchEnsObjectAsyncActions.failure(error));
  }
};

export const fetchExampleEnsObjects: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => async (dispatch, getState: () => RootState) => {
  const state = getState();
  const genomeInfoData: GenomeInfoData = getGenomeInfo(state);
  const genomeInfo = genomeInfoData[genomeId];
  const exampleObjects = getExampleEnsObjects(state);

  if (genomeId && genomeInfo && !exampleObjects.length) {
    genomeInfo.example_objects.forEach((exampleObjectId) => {
      dispatch(fetchEnsObject(exampleObjectId));
    });
  }
};
