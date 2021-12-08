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

import { getTrackPanelGene } from 'src/content/app/genome-browser/state/genomeBrowserApiSlice';
import { TrackPanelGene } from 'src/content/app/genome-browser/state/types/track-panel-gene';
import { shouldFetch } from 'src/shared/helpers/fetchHelper';
import {
  buildEnsObjectId,
  buildRegionObject,
  EnsObjectIdConstituents,
  parseEnsObjectId
} from 'src/shared/helpers/focusObjectHelpers';
import { getEnsObjectLoadingStatus } from 'src/shared/state/focus-object/focusObjectSelectors';
import { getGenomeExampleFocusObjects } from 'src/shared/state/genome/genomeSelectors';

import { LoadingState } from 'src/shared/types/loading-state';
import { RootState } from 'src/store';
import { EnsObject, EnsObjectGene } from './focusObjectTypes';

export type EnsObjectsState = Readonly<{
  [focusObjectId: string]: {
    loadingStatus: LoadingState;
    data: EnsObject | null;
  };
}>;

type BuildGeneObjectParams = {
  genomeId: string;
  objectId: string;
  gene: TrackPanelGene;
};

// FIXME: many fields here are unnecessary for an focusObject
export const buildGeneObject = (
  params: BuildGeneObjectParams
): EnsObjectGene => {
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

const buildLoadingObject = (id: string) => ({
  [id]: {
    loadingStatus: LoadingState.LOADING,
    data: null
  }
});

const buildLoadedObject = (payload: { id: string; data: EnsObject }) => ({
  [payload.id]: {
    data: payload.data,
    loadingStatus: LoadingState.SUCCESS
  }
});

export const fetchExampleEnsObjects =
  (genomeId: string): ThunkAction<void, any, null, Action<string>> =>
  async (dispatch, getState: () => RootState) => {
    const state = getState();
    const exampleFocusObjects = getGenomeExampleFocusObjects(state, genomeId);

    exampleFocusObjects.forEach(({ id, type }) => {
      dispatch(fetchEnsObject({ genomeId, type, objectId: id }));
    });
  };

export const fetchEnsObject = createAsyncThunk(
  'genome-browser/fetch-focus-object',
  async (payload: string | EnsObjectIdConstituents, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const dispatch = thunkAPI.dispatch;

    if (typeof payload === 'string') {
      payload = parseEnsObjectId(payload);
    }
    const { genomeId, objectId } = payload;
    const focusObjectId = buildEnsObjectId(payload);
    const focusObjectLoadingStatus = getEnsObjectLoadingStatus(
      state,
      focusObjectId
    );
    if (!shouldFetch(focusObjectLoadingStatus)) {
      return;
    }

    if (payload.type === 'region') {
      const regionObject = buildRegionObject(payload);
      return {
        id: focusObjectId,
        data: regionObject
      };
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

      const geneEnsObject = buildGeneObject({
        objectId: focusObjectId,
        genomeId,
        gene: result.data?.gene as TrackPanelGene
      });

      return buildLoadedObject({
        id: focusObjectId,
        data: geneEnsObject
      });
    } catch (error) {
      thunkAPI.rejectWithValue(error as Error);
    }
  }
);

const focusObjectSlice = createSlice({
  name: 'genome-browser-focus-object',
  initialState: {} as EnsObjectsState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchEnsObject.fulfilled, (state, action) => {
      state = Object.assign(state, action.payload);
    });
  }
});

export default focusObjectSlice.reducer;
