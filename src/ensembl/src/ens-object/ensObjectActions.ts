import { createAsyncAction } from 'typesafe-actions';
import { Dispatch } from 'redux';

import apiService from 'src/services/api-service';

export const fetchEnsObject = createAsyncAction(
  'ens-object/fetch_ens_object_request',
  'ens-object/fetch_ens_object_success',
  'ens-object/fetch_ens_object_failure'
)<string, {}, Error>();

export const fetchEnsObjectData = (ensObjectId: string) => async (
  dispatch: Dispatch
) => {
  try {
    dispatch(fetchEnsObject.request(ensObjectId));

    const url = `/browser/get_ensembl_object_info/${ensObjectId}`;
    const response = await apiService.fetch(url);
    dispatch(fetchEnsObject.success(response));
  } catch (error) {
    dispatch(fetchEnsObject.failure(error));
  }
};

export const fetchExampleEnsObjects = createAsyncAction(
  'ens-object/fetch_example_ens_objects_request',
  'ens-object/fetch_example_ens_objects_success',
  'ens-object/fetch_example_ens_objects_failure'
)<null, {}, Error>();

export const fetchExampleEnsObjectsData = () => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchExampleEnsObjects.request(null));

    const url = '/browser/example_ens_objects';
    const response = await apiService.fetch(url);
    dispatch(fetchExampleEnsObjects.success(response));
  } catch (error) {
    dispatch(fetchExampleEnsObjects.failure(error));
  }
};
