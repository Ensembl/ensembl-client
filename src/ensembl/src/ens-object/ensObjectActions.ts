import { createAsyncAction } from 'typesafe-actions';
import { Dispatch, ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';

import apiService from 'src/services/api-service';

import { RootState } from 'src/store';
import { EnsObjectResponse, EnsObjectTracksResponse } from './ensObjectTypes';
import {
  humanGeneResponse,
  humanRegionResponse,
  mouseGeneResponse,
  mouseRegionResponse,
  wheatGeneResponse,
  wheatRegionResponse
} from 'tests/data/ens-object/ens-objects';

import { getCommittedSpecies } from 'src/content/app/species-selector/state/speciesSelectorSelectors';
import { CommittedItem } from 'src/content/app/species-selector/types/species-search';

type FetchEnsObjectRequestType = {
  ensObjectId: string;
  genomeId: string;
};

export const fetchEnsObjectAsyncActions = createAsyncAction(
  'ens-object/fetch_ens_object_request',
  'ens-object/fetch_ens_object_success',
  'ens-object/fetch_ens_object_failure'
)<FetchEnsObjectRequestType, EnsObjectResponse, Error>();

export const fetchEnsObject = (ensObjectId: string, genomeId: string) => async (
  dispatch: Dispatch
) => {
  try {
    dispatch(fetchEnsObjectAsyncActions.request({ ensObjectId, genomeId }));

    const url = `/api/genome/info?genome_id=${genomeId}`;
    const response = await apiService.fetch(url, { preserveEndpoint: true });

    dispatch(
      fetchEnsObjectAsyncActions.success({
        ensembl_object: response.alternative_assemblies
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

    const url = `/api/ensembl_object/track_list?obj_id=${ensObjectId}`;
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
)<null, EnsObjectResponse[], Error>();

// TODO: switch to using APIs when available
export const fetchExampleEnsObjects: ActionCreator<
  ThunkAction<void, any, null, Action<string>>
> = () => async (dispatch: Dispatch, getState: () => RootState) => {
  try {
    dispatch(fetchExampleEnsObjectsAsyncActions.request(null));

    const committedSpecies = getCommittedSpecies(getState());
    let ensObjectResponses: EnsObjectResponse[] = [];

    committedSpecies.map((species: CommittedItem) => {
      switch (species.genome_id) {
        case 'homo_sapiens38':
          ensObjectResponses.push(humanGeneResponse, humanRegionResponse);
          break;
        case 'mus_musculus_bdc':
          ensObjectResponses.push(mouseGeneResponse, mouseRegionResponse);
          break;
        case 'triticum_aestivum':
          ensObjectResponses.push(wheatGeneResponse, wheatRegionResponse);
          break;
      }
    });

    dispatch(
      fetchExampleEnsObjectsAsyncActions.success(ensObjectResponses.flat())
    );
  } catch (error) {
    dispatch(fetchExampleEnsObjectsAsyncActions.failure(error));
  }
};
