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
  Action,
  createAsyncThunk,
  createSlice,
  ThunkAction
} from '@reduxjs/toolkit';

import isGeneFocusObject from './isGeneFocusObject';

import { fetchGenomeInfo } from 'src/shared/state/genome/genomeApiSlice';
import { getTrackPanelGene } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';
import { shouldFetch } from 'src/shared/helpers/fetchHelper';
import {
  buildFocusObjectId,
  parseFocusObjectId
} from 'src/shared/helpers/focusObjectHelpers';
import { getFocusObjectLoadingStatus } from 'src/content/app/genome-browser/state/focus-object/focusObjectSelectors';
import { getChrLocationFromStr } from 'src/content/app/genome-browser/helpers/browserHelper';

import { LoadingState } from 'src/shared/types/loading-state';
import type { TrackPanelGene } from 'src/content/app/genome-browser/state/types/track-panel-gene';
import type {
  FocusObject,
  FocusGene,
  FocusObjectIdConstituents,
  FocusRegion
} from 'src/shared/types/focus-object/focusObjectTypes';
import type { RootState } from 'src/store';

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
export const buildGeneObject = (params: BuildGeneObjectParams): FocusGene => {
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

const buildRegionObject = (payload: FocusObjectIdConstituents): FocusRegion => {
  const { genomeId, objectId: regionId } = payload;
  const [chromosome, start, end] = getChrLocationFromStr(regionId);

  return {
    type: 'region',
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
    const dispatch = thunkAPI.dispatch;

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

    if (payload.type === 'region') {
      const regionObject = buildRegionObject(payload);
      return buildLoadedObject({
        id: focusObjectId,
        data: regionObject
      });
    }

    try {
      const dispatchedPromise = dispatch(
        getTrackPanelGene.initiate({
          genomeId,
          geneId: objectId
        })
      );

      thunkAPI.fulfillWithValue(buildLoadingObject(focusObjectId));

      const result = await dispatchedPromise;
      dispatchedPromise.unsubscribe();

      const geneFocusObject = buildGeneObject({
        objectId: focusObjectId,
        genomeId,
        gene: result.data?.gene as TrackPanelGene
      });

      return buildLoadedObject({
        id: focusObjectId,
        data: geneFocusObject
      });
    } catch (error) {
      thunkAPI.rejectWithValue(error as Error);
    }
  }
);

export const updateFocusGeneTranscriptsVisibility = createAsyncThunk(
  'genome-browser/udpate-focus-gene-transcripts-visibility',
  async (payload: { focusGeneId: string; visibleTranscriptIds: string[] }) => {
    // focusGeneId is in the focus object id format, i.e. "<genome_id>:gene:<stable_id>"

    // TODO: save to persistent browser storage
    return payload;
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
        const { focusGeneId, visibleTranscriptIds } = action.payload;
        const focusObject = state[focusGeneId]?.data;
        if (isGeneFocusObject(focusObject)) {
          // this should always be the case, but just checking
          focusObject.visibleTranscriptIds = visibleTranscriptIds;
        }
      }
    );
  }
});

export default focusObjectSlice.reducer;
