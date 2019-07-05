import { createAsyncAction } from 'typesafe-actions';
import { Action, ActionCreator, Dispatch } from 'redux';
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

    // FIXME: the if-branch is temporary, until backend learns to respond with region object data
    if (isRegionObject(ensObjectId)) {
      response = await parseRegionObjectId(ensObjectId);
    } else {
      const url = `/api/ensembl_object/info?object_id=${ensObjectId}`;
      response = await apiService.fetch(url);

      const trackUrl = `/api/ensembl_object/track_list?object_id=${ensObjectId}`;
      response.track = await apiService.fetch(trackUrl);
    }

    dispatch(
      fetchEnsObjectAsyncActions.success({
        [response.ensembl_object_id]: response
      })
    );
  } catch (error) {
    dispatch(fetchEnsObjectAsyncActions.failure(error));
  }
};

// export const fetchEnsObjectTracksAsyncActions = createAsyncAction(
//   'ens-object/fetch_ens_object_tracks_request',
//   'ens-object/fetch_ens_object_tracks_success',
//   'ens-object/fetch_ens_object_tracks_failure'
// )<FetchEnsObjectRequestType, EnsObjectTracksResponse, Error>();

// export const fetchEnsObjectTracks = (
//   ensObjectId: string,
//   genomeId: string
// ) => async (dispatch: Dispatch) => {
//   try {
//     // Do not send the request for regions
//     if (isRegionObject(ensObjectId)) {
//       return;
//     }
//     dispatch(fetchEnsObjectAsyncActions.request());

//     const url = `/api/ensembl_object/track_list?object_id=${ensObjectId}`;
//     const response = await apiService.fetch(url, { preserveEndpoint: true });

//     dispatch(
//       fetchEnsObjectTracksAsyncActions.success({
//         object_tracks: response
//       })
//     );
//   } catch (error) {
//     dispatch(fetchEnsObjectTracksAsyncActions.failure(error));
//   }
// };

export const fetchExampleEnsObjectsAsyncActions = createAsyncAction(
  'ens-object/fetch_example_ens_objects_request',
  'ens-object/fetch_example_ens_objects_success',
  'ens-object/fetch_example_ens_objects_failure'
)<null, ExampleEnsObjectsData, Error>();

export const fetchExampleEnsObjects: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId?: string) => async (dispatch, getState: () => RootState) => {
  try {
    const genomeInfoData: GenomeInfoData = getGenomeInfo(getState());
    const genomeInfo = genomeId && genomeInfoData[genomeId];
    const exampleObjects: ExampleEnsObjectsData = getExampleEnsObjects(
      getState()
    );

    if (genomeId && genomeInfo && !exampleObjects[genomeId]) {
      dispatch(fetchExampleEnsObjectsAsyncActions.request(null));
      genomeInfo.example_objects.forEach((exampleObjectId) => {
        dispatch(fetchEnsObject(exampleObjectId));
      });
    }
  } catch (error) {
    dispatch(fetchExampleEnsObjectsAsyncActions.failure(error));
  }
};

// FIXME: remove when backend learns to return info about a region object
const isRegionObject = (objectId: string) => {
  return /:region:/.test(objectId);
};

// FIXME: the function below is horrible and should have never been written
// Remove when backend learns to return info about a region object
// (writing this as async function so that it has the same promise interface as apiService.fetch)
const parseRegionObjectId = async (objectId: string) => {
  const [genomeId, , chromosome, region] = objectId.split(':');
  const [start, end] = region.split('-').map(Number);

  return {
    bio_type: null,
    label: `${chromosome}:${region}`,
    ensembl_object_id: objectId,
    genome_id: genomeId,
    spliced_length: null,
    location: {
      chromosome,
      start,
      end
    },
    object_type: 'region',
    stable_id: null,
    strand: null,
    description: null,
    track: null
  };
};
