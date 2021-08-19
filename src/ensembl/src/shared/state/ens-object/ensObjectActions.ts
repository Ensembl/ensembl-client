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
import { gql } from '@apollo/client';

import { client } from 'src/gql-client';

import { shouldFetch } from 'src/shared/helpers/fetchHelper';
import {
  parseEnsObjectId,
  buildEnsObjectId,
  buildRegionObject,
  EnsObjectIdConstituents,
  buildGeneObject
} from './ensObjectHelpers';

import { getGenomeExampleFocusObjects } from 'src/shared/state/genome/genomeSelectors';
import { getEnsObjectLoadingStatus } from 'src/shared/state/ens-object/ensObjectSelectors';

import { EnsObject } from './ensObjectTypes';
import { RootState } from 'src/store';
import { FullGene } from 'src/shared/types/thoas/gene';

export const fetchEnsObjectAsyncActions = createAsyncAction(
  'ens-object/fetch_ens_object_request',
  'ens-object/fetch_ens_object_success',
  'ens-object/fetch_ens_object_failure'
)<string, { id: string; data: EnsObject }, Error>();

const geneQuery = gql`
  query Gene($genomeId: String!, $geneId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $geneId }) {
      name
      stable_id
      unversioned_stable_id
      symbol
      slice {
        region {
          name
        }
        location {
          start
          end
        }
        strand {
          code
        }
      }
      metadata {
        biotype {
          label
        }
      }
      transcripts {
        stable_id
        slice {
          location {
            length
          }
        }
        product_generating_contexts {
          product_type
        }
        metadata {
          biotype {
            label
          }
          canonical {
            value
            label
          }
          mane {
            value
            label
            ncbi_transcript {
              id
              url
            }
          }
        }
      }
    }
  }
`;

export const fetchEnsObject =
  (
    payload: string | EnsObjectIdConstituents
  ): ThunkAction<void, any, null, Action<string>> =>
  async (dispatch, getState: () => RootState) => {
    if (typeof payload === 'string') {
      payload = parseEnsObjectId(payload);
    }
    const state = getState();
    const ensObjectId = buildEnsObjectId(payload);
    const ensObjectLoadingStatus = getEnsObjectLoadingStatus(
      state,
      ensObjectId
    );
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
      const { genomeId, objectId } = payload;

      client
        .query<{ gene: Partial<FullGene> }>({
          query: geneQuery,
          variables: {
            genomeId,
            geneId: objectId
          }
        })
        .then(({ data }) => {
          dispatch(
            fetchEnsObjectAsyncActions.success({
              id: ensObjectId,
              data: buildGeneObject(data.gene, genomeId)
            })
          );
        });
    } catch (error) {
      dispatch(fetchEnsObjectAsyncActions.failure(error));
    }
  };

export const fetchExampleEnsObjects =
  (genomeId: string): ThunkAction<void, any, null, Action<string>> =>
  async (dispatch, getState: () => RootState) => {
    const state = getState();
    const exampleFocusObjects = getGenomeExampleFocusObjects(state, genomeId);

    exampleFocusObjects.forEach(({ id, type }) => {
      dispatch(fetchEnsObject({ genomeId, type, objectId: id }));
    });
  };
