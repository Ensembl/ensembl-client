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

import {
  createAsyncThunk,
  createSlice,
  type Action,
  type ThunkAction
} from '@reduxjs/toolkit';

import isGeneFocusObject from './isGeneFocusObject';
import * as focusObjectStorageService from 'src/content/app/genome-browser/services/focus-objects/focusObjectStorageService';

import { fetchGenomeInfo } from 'src/shared/state/genome/genomeApiSlice';
import { getTrackPanelGene } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

import { shouldFetch } from 'src/shared/helpers/fetchHelper';
import {
  buildFocusObjectId,
  parseFocusObjectId
} from 'src/shared/helpers/focusObjectHelpers';
import { getFocusObjectLoadingStatus } from 'src/content/app/genome-browser/state/focus-object/focusObjectSelectors';
import { getChrLocationFromStr } from 'src/content/app/genome-browser/helpers/browserHelper';

import { getFocusObject as getFocusObjectFromStorage } from 'src/content/app/genome-browser/services/focus-objects/focusObjectStorageService';

import { LoadingState } from 'src/shared/types/loading-state';
import type { TrackPanelGene } from 'src/content/app/genome-browser/state/types/track-panel-gene';
import type {
  FocusObject,
  FocusGene,
  FocusObjectIdConstituents,
  FocusLocation,
  FocusVariant
} from 'src/shared/types/focus-object/focusObjectTypes';
import type { RootState, ThunkApi } from 'src/store';

export type FocusObjectsState = Readonly<{
  [focusObjectId: string]: {
    loadingStatus: LoadingState;
    data: FocusObject | null;
  };
}>;

type BuildGeneObjectParams = {
  genomeId: string;
  objectId: string;
  gene: TrackPanelGene;
};

// FIXME: many fields here are unnecessary for an focusObject
export const buildFocusGeneObject = (
  params: BuildGeneObjectParams
): FocusGene => {
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
    strand,
    visibleTranscriptIds: null
  };
};

const buildLoadingObject = (id: string) => ({
  [id]: {
    loadingStatus: LoadingState.LOADING,
    data: null
  }
});

const buildLoadedObject = (payload: { id: string; data: FocusObject }) => ({
  [payload.id]: {
    data: payload.data,
    loadingStatus: LoadingState.SUCCESS
  }
});

const buildFocusLocationObject = (
  payload: FocusObjectIdConstituents
): FocusLocation => {
  const { genomeId, objectId: regionId } = payload;
  const [chromosome, start, end] = getChrLocationFromStr(regionId);

  return {
    type: 'location',
    genome_id: genomeId,
    object_id: buildFocusObjectId(payload),
    label: regionId,
    location: {
      chromosome,
      start,
      end
    }
  };
};

const buildFocusVariantObject = (payload: {
  genomeId: string;
  objectId: string;
  variantId: string;
}): FocusVariant => {
  const { genomeId, objectId, variantId } = payload;
  return {
    type: 'variant',
    genome_id: genomeId,
    object_id: objectId,
    label: variantId,
    location: {
      // just some arbitrary hardcoded location; this will change to proper data in the future
      chromosome: '13',
      start: 1_000_000,
      end: 1_000_001
    }
  };
};

export const fetchExampleFocusObjects =
  (genomeId: string): ThunkAction<void, any, void, Action<string>> =>
  async (dispatch) => {
    const genomeInfoResponsePromise = dispatch(
      fetchGenomeInfo.initiate(genomeId)
    );
    const { data: genomeInfoResponse } = await genomeInfoResponsePromise;
    genomeInfoResponsePromise.unsubscribe();

    if (!genomeInfoResponse) {
      // failed network request; nothing to do
      return;
    }

    const { genomeInfo } = genomeInfoResponse;
    const exampleFocusObjects = genomeInfo.example_objects;

    exampleFocusObjects.forEach(({ id, type }) => {
      dispatch(fetchFocusObject({ genomeId, type, objectId: id }));
    });
  };

export const fetchFocusObject = createAsyncThunk(
  'genome-browser/fetch-focus-object',
  async (payload: string | FocusObjectIdConstituents, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;

    if (typeof payload === 'string') {
      payload = parseFocusObjectId(payload);
    }
    const { genomeId, objectId } = payload;
    const focusObjectId = buildFocusObjectId(payload);
    const focusObjectLoadingStatus = getFocusObjectLoadingStatus(
      state,
      focusObjectId
    );
    if (!shouldFetch(focusObjectLoadingStatus)) {
      return;
    }

    if (payload.type === 'location') {
      const focusLocationObject = buildFocusLocationObject({
        ...payload,
        type: 'location'
      });
      return buildLoadedObject({
        id: focusObjectId,
        data: focusLocationObject
      });
    }

    try {
      thunkAPI.fulfillWithValue(buildLoadingObject(focusObjectId));

      if (payload.type === 'gene') {
        return await fetchFocusGene(
          {
            genomeId,
            geneId: objectId,
            objectId: focusObjectId
          },
          thunkAPI
        );
      } else if (payload.type === 'variant') {
        return await fetchFocusVariant({
          genomeId,
          variantId: objectId,
          objectId: focusObjectId
        });
      }
    } catch (error) {
      thunkAPI.rejectWithValue(error as Error);
    }
  }
);

const fetchFocusGene = async (
  payload: {
    genomeId: string;
    geneId: string;
    objectId: string; // is in format genomeId:type:stableId
  },
  thunkApi: ThunkApi
) => {
  const { genomeId, geneId, objectId } = payload;
  const { dispatch } = thunkApi;
  const dispatchedPromise = dispatch(
    getTrackPanelGene.initiate({
      genomeId,
      geneId
    })
  );

  const result = await dispatchedPromise;
  dispatchedPromise.unsubscribe();

  const geneFocusObject = buildFocusGeneObject({
    objectId,
    genomeId,
    gene: result.data?.gene as TrackPanelGene
  });

  const storedFocusGeneData = await getFocusObjectFromStorage(objectId);
  geneFocusObject.visibleTranscriptIds =
    storedFocusGeneData?.visibleTranscriptIds ?? null;

  return buildLoadedObject({
    id: objectId,
    data: geneFocusObject
  });
};

const fetchFocusVariant = async (payload: {
  genomeId: string;
  variantId: string;
  objectId: string; // is in format genomeId:type:stableId
}) => {
  // TODO: will fetch variant data from an api when it is ready
  return buildLoadedObject({
    id: payload.objectId,
    data: buildFocusVariantObject(payload)
  });
};

export const updateFocusGeneTranscriptsVisibility = createAsyncThunk(
  'genome-browser/udpate-focus-gene-transcripts-visibility',
  async (
    payload: { focusGeneId: string; visibleTranscriptIds: string[] },
    thunkAPI
  ) => {
    // focusGeneId is in the focus object id format, i.e. "<genome_id>:gene:<stable_id>"
    const { focusGeneId, visibleTranscriptIds } = payload;
    const state = thunkAPI.getState() as RootState;
    const focusGene = state.browser.focusObjects[focusGeneId]?.data;

    if (!isGeneFocusObject(focusGene)) {
      return null; // this shouldn't happen
    }

    const updatedFocusGene = {
      ...focusGene,
      visibleTranscriptIds: visibleTranscriptIds
    };
    await focusObjectStorageService.updateFocusObject(
      focusGeneId,
      updatedFocusGene
    );
    return updatedFocusGene;
  }
);

const focusObjectSlice = createSlice({
  name: 'genome-browser-focus-object',
  initialState: {} as FocusObjectsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFocusObject.fulfilled, (state, action) => {
      state = Object.assign(state, action.payload);
    });
    builder.addCase(
      updateFocusGeneTranscriptsVisibility.fulfilled,
      (state, action) => {
        const focusGene = action.payload;
        if (focusGene) {
          state[focusGene.object_id].data = focusGene;
        }
      }
    );
  }
});

export default focusObjectSlice.reducer;
