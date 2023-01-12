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

import { useState, useEffect, useRef } from 'react';

import { useAppDispatch } from 'src/store';

import { getChrLocationFromStr } from 'src/content/app/genome-browser/helpers/browserHelper';

import {
  getTrackPanelGene,
  getGBRegion
} from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

import type { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import type { FocusObjectIdConstituents } from 'src/shared/types/focus-object/focusObjectTypes';

type Params = {
  genomeId: string | undefined;
  parsedFocusObjectId: FocusObjectIdConstituents | undefined;
  parsedLocation: ChrLocation | undefined;
  hasMalformedLocation: boolean;
};

const initialState = {
  isValidating: false,
  doneValidating: false,
  isMissingFocusObject: false,
  isInvalidLocation: false
};

const useGenomeBrowserUrlValidator = (params: Params) => {
  const [state, setState] = useState(initialState);
  const {
    genomeId,
    parsedFocusObjectId,
    parsedLocation,
    hasMalformedLocation
  } = params;
  const dispatch = useAppDispatch();

  const stateRef = useRef(state);
  const postValidationQueueRef = useRef<Array<() => unknown>>([]);

  useEffect(() => {
    stateRef.current = state;
  });

  useEffect(() => {
    if (!genomeId || !parsedFocusObjectId) {
      onValidationComplete(initialState); // nothing to validate
      return;
    }
    const focusCheckParams = {
      genomeId,
      parsedFocusObjectId,
      dispatch
    };

    const focusCheckPromise = checkFocusObject(focusCheckParams);
    const checkPromises = [focusCheckPromise] as Array<
      ReturnType<typeof checkFocusObject | typeof checkLocationFromUrl>
    >;

    if (hasMalformedLocation) {
      checkPromises.push(Promise.resolve({ isInvalidLocation: true }));
    } else if (parsedLocation) {
      const [regionName, start, end] = parsedLocation;
      const locationCheckPromise = checkLocationFromUrl({
        genomeId,
        regionName,
        start,
        end,
        dispatch
      });
      checkPromises.push(locationCheckPromise);
    }

    setState({ ...initialState, isValidating: true });

    Promise.all(checkPromises).then((checkResults) => {
      const newState = {
        isValidating: false,
        doneValidating: true,
        isMissingFocusObject: false,
        isInvalidLocation: hasMalformedLocation || false
      };
      for (const result of checkResults) {
        if ('isMissingFocusObject' in result) {
          newState.isMissingFocusObject = result.isMissingFocusObject;
        } else if ('isInvalidLocation' in result) {
          newState.isInvalidLocation = result.isInvalidLocation;
        }
      }
      setState(newState);
      onValidationComplete(newState);
    });
  }, [genomeId]);

  const runAfterValidation = (fn: () => unknown) => {
    if (
      stateRef.current.doneValidating &&
      !stateRef.current.isMissingFocusObject &&
      !stateRef.current.isInvalidLocation
    ) {
      fn();
    } else {
      postValidationQueueRef.current.push(fn);
    }
  };

  const onValidationComplete = (state: typeof initialState) => {
    setState({ ...state, doneValidating: true });
    if (state.isMissingFocusObject || state.isInvalidLocation) {
      return;
    }
    postValidationQueueRef.current.forEach((fn) => fn());
    postValidationQueueRef.current = [];
  };

  const resetValidator = () => {
    setState({
      ...initialState,
      doneValidating: true // so that functions that need to run after validation could run
    });
  };

  return {
    ...state,
    runAfterValidation,
    resetValidator
  };
};

type CheckFocusObjectParams = {
  genomeId: NonNullable<Params['genomeId']>;
  parsedFocusObjectId: NonNullable<Params['parsedFocusObjectId']>;
  dispatch: ReturnType<typeof useAppDispatch>;
};

const checkFocusObject = async (
  params: CheckFocusObjectParams
): Promise<{ isMissingFocusObject: boolean }> => {
  const { type } = params.parsedFocusObjectId;

  if (type === 'gene') {
    return checkFocusGene(params);
  } else if (type === 'location') {
    return checkFocusLocation(params);
  }

  return { isMissingFocusObject: false }; // largely unnecessary line (code should never reach it), to satisfy the function contract
};

const checkFocusGene = async (params: CheckFocusObjectParams) => {
  const {
    genomeId,
    parsedFocusObjectId: { objectId: geneId },
    dispatch
  } = params;

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

const checkFocusLocation = async (params: CheckFocusObjectParams) => {
  let isMissingFocusObject = false;

  try {
    const [regionName, start, end] = getChrLocationFromStr(
      params.parsedFocusObjectId.objectId
    );
    const locationCheckResult = await checkLocationFromUrl({
      genomeId: params.genomeId,
      regionName,
      start,
      end,
      dispatch: params.dispatch
    });
    if (locationCheckResult.isInvalidLocation) {
      isMissingFocusObject = true;
    }
  } catch {
    isMissingFocusObject = true;
  }

  return { isMissingFocusObject };
};

type CheckLocationFromUrlParams = {
  genomeId: NonNullable<Params['genomeId']>;
  regionName: string;
  start: number;
  end: number;
  dispatch: ReturnType<typeof useAppDispatch>;
};

const checkLocationFromUrl = async (params: CheckLocationFromUrlParams) => {
  const { genomeId, regionName, start, end, dispatch } = params;

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

export default useGenomeBrowserUrlValidator;
