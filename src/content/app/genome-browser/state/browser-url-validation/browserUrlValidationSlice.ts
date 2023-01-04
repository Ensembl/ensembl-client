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

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { parseFocusIdFromUrl } from 'src/shared/helpers/focusObjectHelpers';
import { getChrLocationFromStr } from 'src/content/app/genome-browser/helpers/browserHelper';

import {
  getTrackPanelGene,
  getGBRegion
} from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

// QUESTION: Should this only run on page load? Or on every genome id / focus object id change?

type State = {
  genomeIdInUrl: string | null; // TODO: does this belong here?
  focusObjectIdInUrl: string | null; // TODO: does this belong here?
  locationInUrl: string | null; // TODO: does this belong here?
  isMissingGenomeId: boolean | undefined; // TODO: does this belong here?
  isMalformedFocusObjectId: boolean;
  isMissingFocusObject: boolean;
  isInvalidLocation: boolean;
};

const initialState: State = {
  genomeIdInUrl: null,
  focusObjectIdInUrl: null,
  locationInUrl: null,
  isMissingGenomeId: false,
  isMalformedFocusObjectId: false,
  isMissingFocusObject: false,
  isInvalidLocation: false
};

type ThunkApi = Parameters<Parameters<typeof createAsyncThunk>[1]>[1];

type BrowserUrlElements = {
  genomeId: string;
  focusObject?: string | null;
  location?: string | null;
};

export const checkGenomeBrowserUrlElements = createAsyncThunk(
  'genome-browser/check-url-elements',
  async (payload: BrowserUrlElements, thunkApi) => {
    const {
      genomeId,
      focusObject: focusObjectFromUrl,
      location: locationFromUrl
    } = payload;
    const newState = { ...initialState };

    // checking focus object
    if (!focusObjectFromUrl) {
      return; // nothing to check
    }
    try {
      // focus object can be parsed
      const { type, objectId } = parseFocusIdFromUrl(focusObjectFromUrl);
      if (type === 'gene') {
        const focusGeneCheck = await checkFocusGene(
          { genomeId, geneId: objectId },
          thunkApi
        );
        newState.isMissingFocusObject = focusGeneCheck.isMissingFocusObject;
      } else if (type === 'location') {
        const [regionName, start, end] = getChrLocationFromStr(objectId);
        const focusLocationCheck = await checkLocationFromUrl(
          { genomeId, regionName, start, end },
          thunkApi
        );
        newState.isMissingFocusObject = focusLocationCheck.isInvalidLocation;
      }
    } catch {
      // focus object cannot be parsed
      newState.isMalformedFocusObjectId = true;
    }

    // checking location in the url
    if (locationFromUrl) {
      try {
        const [regionName, start, end] = getChrLocationFromStr(locationFromUrl);
        const locationCheck = await checkLocationFromUrl(
          { genomeId, regionName, start, end },
          thunkApi
        );
        newState.isInvalidLocation = locationCheck.isInvalidLocation;
      } catch {
        newState.isInvalidLocation = true;
      }
    }

    return newState;
  }
);

const checkFocusGene = async (
  params: { genomeId: string; geneId: string },
  thunkApi: ThunkApi
) => {
  const { genomeId, geneId } = params;
  const { dispatch } = thunkApi;
  const dispatchedPromise = dispatch(
    getTrackPanelGene.initiate({
      genomeId,
      geneId
    })
  );

  const result = await dispatchedPromise;
  dispatchedPromise.unsubscribe();

  const { isError: isGeneQueryError, error: geneQueryError } = result;

  const isMissingGene =
    isGeneQueryError &&
    'meta' in geneQueryError &&
    geneQueryError.meta.data.gene === null;

  return {
    isMissingFocusObject: isMissingGene
  };
};

const checkLocationFromUrl = async (
  params: {
    genomeId: string;
    regionName: string;
    start: number;
    end: number;
  },
  thunkApi: ThunkApi
) => {
  const { genomeId, regionName, start, end } = params;
  const { dispatch } = thunkApi;
  let isInvalidLocation = false;

  const dispatchedPromise = dispatch(
    getGBRegion.initiate({
      genomeId,
      regionName
    })
  );

  const result = await dispatchedPromise;
  dispatchedPromise.unsubscribe();

  const {
    data: regionData,
    isError: isRegionQueryError,
    error: regionQueryError
  } = result;

  if (regionData) {
    const { length, topology } = regionData.region;
    const isStartOutOfBounds = start < 1 || start > length;
    const isEndOutOfBounds = end < 1 || end > length;
    const isStartGreaterThanEnd = start > end && topology === 'linear';

    if (isStartOutOfBounds || isEndOutOfBounds || isStartGreaterThanEnd) {
      isInvalidLocation = true;
    }
  } else if (
    isRegionQueryError &&
    (regionQueryError as any)?.meta?.errors?.[0]?.extensions?.code ===
      'REGION_NOT_FOUND'
  ) {
    isInvalidLocation = true;
  }

  return {
    isInvalidLocation
  };
};

const browserUrlValidationSlice = createSlice({
  name: 'genome-browser-url-validation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(checkGenomeBrowserUrlElements.fulfilled, (_, action) => {
      return action.payload;
    });
  }
});

export default browserUrlValidationSlice;
