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

import { shouldFetch } from 'src/shared/helpers/fetchHelper';
import {
  parseEnsObjectId,
  buildEnsObjectId,
  buildRegionObject,
  EnsObjectIdConstituents
} from './ensObjectHelpers';

import { getTrackPanelGene } from 'src/content/app/browser/state/genomeBrowserApiSlice';

import { getGenomeExampleFocusObjects } from 'src/shared/state/genome/genomeSelectors';
import { getEnsObjectLoadingStatus } from 'src/shared/state/ens-object/ensObjectSelectors';

import { EnsObject, EnsObjectGene } from './ensObjectTypes';
import type { TrackPanelGene } from 'src/content/app/browser/state/types/track-panel-gene';
import { RootState } from 'src/store';

export const fetchEnsObjectAsyncActions = createAsyncAction(
  'ens-object/fetch_ens_object_request',
  'ens-object/fetch_ens_object_success',
  'ens-object/fetch_ens_object_failure'
)<string, { id: string; data: EnsObject }, Error>();

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
      const dispatchedPromise = dispatch(
        getTrackPanelGene.initiate({
          genomeId: payload.genomeId,
          geneId: payload.objectId
        })
      );
      const result = await dispatchedPromise;
      dispatchedPromise.unsubscribe();

      dispatch(fetchEnsObjectAsyncActions.request(ensObjectId));
      const { genomeId } = payload;

      const geneEnsObject = buildGeneObject({
        objectId: buildEnsObjectId(payload),
        genomeId,
        gene: result.data?.gene as TrackPanelGene
      });

      dispatch(
        fetchEnsObjectAsyncActions.success({
          id: ensObjectId,
          data: geneEnsObject
        })
      );
    } catch (error) {
      dispatch(fetchEnsObjectAsyncActions.failure(error as Error));
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

type BuildGeneObjectParams = {
  genomeId: string;
  objectId: string;
  gene: TrackPanelGene;
};

// FIXME: many fields here are unnecessary for an ensObject
const buildGeneObject = (params: BuildGeneObjectParams): EnsObjectGene => {
  const {
    slice: {
      location: { start, end },
      region: { name: chromosome },
      strand: { code: strand }
    }
  } = params.gene;

  return {
    type: 'gene',
    object_id: params.objectId,
    genome_id: params.genomeId,
    label: params.gene.symbol || params.gene.stable_id,
    location: {
      chromosome,
      start,
      end
    },
    stable_id: params.gene.unversioned_stable_id,
    versioned_stable_id: params.gene.stable_id,
    bio_type: params.gene.metadata.biotype.label,
    strand
  };
};
