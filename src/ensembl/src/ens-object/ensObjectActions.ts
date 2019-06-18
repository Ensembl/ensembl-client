import { createAsyncAction } from 'typesafe-actions';
import { Action, ActionCreator, Dispatch } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { RootState } from 'src/store';
import apiService from 'src/services/api-service';

import { GenomeInfoData, GenomeInfo } from 'src/genome/genomeTypes';
import { getGenomeInfo } from 'src/genome/genomeSelectors';
import { getExampleEnsObjects } from 'src/ens-object/ensObjectSelectors';
import {
  EnsObjectResponse,
  EnsObjectTracksResponse,
  ExampleEnsObjectsData
} from './ensObjectTypes';

type FetchEnsObjectRequestType = {
  ensObjectId: string;
  genomeId: string;
};

export const fetchEnsObjectAsyncActions = createAsyncAction(
  'ens-object/fetch_ens_object_request',
  'ens-object/fetch_ens_object_success',
  'ens-object/fetch_ens_object_failure'
)<FetchEnsObjectRequestType, EnsObjectResponse, Error>();

export const fetchEnsObject: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (ensObjectId: string, genomeId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchEnsObjectAsyncActions.request({ ensObjectId, genomeId }));

    const url = `/api/ensembl_object/info?object_id=${ensObjectId}`;
    const response = await apiService.fetch(url);
    dispatch(
      fetchEnsObjectAsyncActions.success({
        ensembl_object: response
      })
    );
  } catch (error) {
    dispatch(fetchEnsObjectAsyncActions.failure(error));
  }
};

export const fetchEnsObjectTracksAsyncActions = createAsyncAction(
  'ens-object/fetch_ens_object_tracks_request',
  'ens-object/fetch_ens_object_tracks_success',
  'ens-object/fetch_ens_object_tracks_failure'
)<FetchEnsObjectRequestType, EnsObjectTracksResponse, Error>();

export const fetchEnsObjectTracks = (
  ensObjectId: string,
  genomeId: string
) => async (dispatch: Dispatch) => {
  try {
    dispatch(fetchEnsObjectAsyncActions.request({ ensObjectId, genomeId }));

    const url = `/api/ensembl_object/track_list?object_id=${ensObjectId}`;
    const response = await apiService.fetch(url, { preserveEndpoint: true });

    dispatch(
      fetchEnsObjectTracksAsyncActions.success({
        object_tracks: response.alternative_assemblies
      })
    );
  } catch (error) {
    dispatch(fetchEnsObjectTracksAsyncActions.failure(error));
  }
};

export const fetchExampleEnsObjectsAsyncActions = createAsyncAction(
  'ens-object/fetch_example_ens_objects_request',
  'ens-object/fetch_example_ens_objects_success',
  'ens-object/fetch_example_ens_objects_failure'
)<null, ExampleEnsObjectsData, Error>();

export const fetchExampleEnsObjects: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId?: string) => async (
  dispatch: Dispatch,
  getState: () => RootState
) => {
  try {
    const genomeInfoData: GenomeInfoData = getGenomeInfo(getState());

    const exampleObjects: ExampleEnsObjectsData = getExampleEnsObjects(
      getState()
    );

    if (genomeId) {
      if (!exampleObjects[genomeId]) {
        dispatch(fetchExampleEnsObjectsAsyncActions.request(null));
        const geneUrl = `/api/ensembl_object/info?object_id=${genomeInfoData[genomeId].example_objects[0]}`;
        const geneResponse = await apiService.fetch(geneUrl);

        // const regionUrl = `/api/ensembl_object/info?object_id=${genomeInfoData[genomeId].example_objects[1]}`;
        // const regionResponse = await apiService.fetch(regionUrl);

        dispatch(
          fetchExampleEnsObjectsAsyncActions.success({
            [genomeId]: [geneResponse]
          })
        );
      }
    } else {
      Object.values(genomeInfoData).forEach(async (genomeInfo: GenomeInfo) => {
        if (!exampleObjects[genomeInfo.genome_id]) {
          dispatch(fetchExampleEnsObjectsAsyncActions.request(null));

          const geneUrl = `/api/ensembl_object/info?object_id=${genomeInfo.example_objects[0]}`;
          const geneResponse = await apiService.fetch(geneUrl);

          // const regionUrl = `/api/ensembl_object/info?object_id=${genomeInfo.example_objects[1]}`;
          // const regionResponse = await apiService.fetch(regionUrl);

          dispatch(
            fetchExampleEnsObjectsAsyncActions.success({
              [genomeInfo.genome_id]: [geneResponse]
            })
          );
        }
      });
    }
  } catch (error) {
    dispatch(fetchExampleEnsObjectsAsyncActions.failure(error));
  }
};
