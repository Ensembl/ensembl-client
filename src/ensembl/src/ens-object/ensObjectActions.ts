import { createAsyncAction } from 'typesafe-actions';
import { Dispatch, ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

// import apiService from 'src/services/api-service';

import { RootState } from 'src/store';
import { GenomeInfo } from 'src/genome/genomeTypes';
import { EnsObjectResponse, EnsObjectTracksResponse } from './ensObjectTypes';
import {
  humanGeneResponse,
  humanRegionResponse,
  mouseGeneResponse,
  mouseRegionResponse,
  wheatGeneResponse,
  wheatRegionResponse,
  humanGeneTracksResponse,
  mouseGeneTracksResponse,
  wheatGeneTracksResponse
} from 'tests/data/ens-object/ens-objects';
import { getGenomeInfo } from 'src/genome/genomeSelectors';

type FetchEnsObjectRequestType = {
  ensObjectId: string;
  genomeId: string;
};

export const fetchEnsObjectAsyncActions = createAsyncAction(
  'ens-object/fetch_ens_object_request',
  'ens-object/fetch_ens_object_success',
  'ens-object/fetch_ens_object_failure'
)<FetchEnsObjectRequestType, EnsObjectResponse, Error>();

// TODO: switch to using APIs when available
export const fetchEnsObject = (ensObjectId: string, genomeId: string) => (
  dispatch: Dispatch
) => {
  try {
    dispatch(fetchEnsObjectAsyncActions.request({ ensObjectId, genomeId }));

    let ensObjectResponse: EnsObjectResponse = {
      ensembl_object: {}
    };

    switch (genomeId) {
      case 'homo_sapiens38':
        if (ensObjectId.includes('gene') === true) {
          ensObjectResponse = humanGeneResponse;
        } else {
          ensObjectResponse = humanRegionResponse;
        }
        break;
      case 'mus_musculus_bdc':
        if (ensObjectId.includes('gene') === true) {
          ensObjectResponse = mouseGeneResponse;
        } else {
          ensObjectResponse = mouseRegionResponse;
        }
        break;
      case 'triticum_aestivum':
        if (ensObjectId.includes('gene') === true) {
          ensObjectResponse = wheatGeneResponse;
        } else {
          ensObjectResponse = wheatRegionResponse;
        }
        break;
    }

    dispatch(fetchEnsObjectAsyncActions.success(ensObjectResponse));
  } catch (error) {
    dispatch(fetchEnsObjectAsyncActions.failure(error));
  }
};

export const fetchEnsObjectTracksAsyncActions = createAsyncAction(
  'ens-object/fetch_ens_object_tracks_request',
  'ens-object/fetch_ens_object_tracks_success',
  'ens-object/fetch_ens_object_tracks_failure'
)<FetchEnsObjectRequestType, EnsObjectTracksResponse, Error>();

// TODO: switch to using APIs when available
export const fetchEnsObjectTracks = (ensObjectId: string, genomeId: string) => (
  dispatch: Dispatch
) => {
  try {
    dispatch(fetchEnsObjectAsyncActions.request({ ensObjectId, genomeId }));

    let ensObjectTracks: EnsObjectTracksResponse = {
      object_tracks: {}
    };

    switch (genomeId) {
      case 'homo_sapiens38':
        if (ensObjectId.includes('gene') === true) {
          ensObjectTracks = humanGeneTracksResponse;
        }
        break;
      case 'mus_musculus_bdc':
        if (ensObjectId.includes('gene') === true) {
          ensObjectTracks = mouseGeneTracksResponse;
        }
        break;
      case 'triticum_aestivum':
        if (ensObjectId.includes('gene') === true) {
          ensObjectTracks = wheatGeneTracksResponse;
        }
        break;
    }

    dispatch(fetchEnsObjectTracksAsyncActions.success(ensObjectTracks));
  } catch (error) {
    dispatch(fetchEnsObjectTracksAsyncActions.failure(error));
  }
};

export const fetchExampleEnsObjectsAsyncActions = createAsyncAction(
  'ens-object/fetch_example_ens_objects_request',
  'ens-object/fetch_example_ens_objects_success',
  'ens-object/fetch_example_ens_objects_failure'
)<string, EnsObjectResponse[], Error>();

// TODO: switch to using APIs when available
export const fetchExampleEnsObjects: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = (genomeId: string) => (dispatch: Dispatch, getState: () => RootState) => {
  try {
    dispatch(fetchExampleEnsObjectsAsyncActions.request(genomeId));

    const genomeInfo = getGenomeInfo(getState()) as GenomeInfo;
    let ensObjectsResponse: EnsObjectResponse[] = [];

    genomeInfo.example_objects.map((ensObjectId: string) => {
      switch (ensObjectId) {
        case 'homo_sapiens38':
          ensObjectsResponse.push(humanGeneResponse, humanRegionResponse);
          break;
        case 'mus_musculus_bdc':
          ensObjectsResponse.push(mouseGeneResponse, mouseRegionResponse);
          break;
        case 'triticum_aestivum':
          ensObjectsResponse.push(wheatGeneResponse, wheatRegionResponse);
          break;
      }
    });

    dispatch(fetchExampleEnsObjectsAsyncActions.success(ensObjectsResponse));
  } catch (error) {
    dispatch(fetchExampleEnsObjectsAsyncActions.failure(error));
  }
};
