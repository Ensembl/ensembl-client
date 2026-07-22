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

import { useState, useEffect, useRef, useCallback } from 'react';

import { useAppDispatch } from 'src/store';

import {
  getChrLocationFromStr,
  validateGenomicLocation
} from 'src/content/app/genome-browser/helpers/browserHelper';

import {
  getGBTranscriptSummary,
  getTrackPanelGene
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
  const [validationResultState, setValidationResultState] = useState({
    validationKey: null as string | null,
    isMissingFocusObject: false,
    isInvalidLocation: false
  });
  const {
    genomeId,
    parsedFocusObjectId,
    parsedLocation,
    hasMalformedLocation
  } = params;
  const dispatch = useAppDispatch();
  const focusObjectType = parsedFocusObjectId?.type;
  const focusObjectId = parsedFocusObjectId?.objectId;
  const locationRegionName = parsedLocation?.[0];
  const locationStart = parsedLocation?.[1];
  const locationEnd = parsedLocation?.[2];
  const hasFocusObjectToValidate = Boolean(
    genomeId && focusObjectType && focusObjectId
  );
  const validationKey = hasFocusObjectToValidate
    ? JSON.stringify({
        genomeId,
        focusObjectType,
        focusObjectId,
        locationRegionName,
        locationStart,
        locationEnd,
        hasMalformedLocation
      })
    : null;
  const currentState = getCurrentValidationState({
    hasFocusObjectToValidate,
    validationKey,
    validationResultState
  });

  const stateRef = useRef(currentState);
  const postValidationQueueRef = useRef<Array<() => unknown>>([]);

  const flushPostValidationQueue = useCallback(() => {
    postValidationQueueRef.current.forEach((fn) => fn());
    postValidationQueueRef.current = [];
  }, []);

  useEffect(() => {
    if (!hasFocusObjectToValidate) {
      flushPostValidationQueue();
      return;
    }

    let isCancelled = false;
    const validatedGenomeId = genomeId as string;
    const validatedParsedFocusObjectId = {
      genomeId: validatedGenomeId,
      type: focusObjectType as string,
      objectId: focusObjectId as string
    };

    const focusCheckParams = {
      genomeId: validatedGenomeId,
      parsedFocusObjectId: validatedParsedFocusObjectId,
      dispatch
    };

    const focusCheckPromise = checkFocusObject(focusCheckParams);
    const checkPromises = [focusCheckPromise] as Array<
      ReturnType<typeof checkFocusObject | typeof checkLocationFromUrl>
    >;

    if (hasMalformedLocation) {
      checkPromises.push(Promise.resolve({ isInvalidLocation: true }));
    } else if (
      locationRegionName &&
      typeof locationStart === 'number' &&
      typeof locationEnd === 'number'
    ) {
      const locationCheckPromise = checkLocationFromUrl({
        genomeId: validatedGenomeId,
        regionName: locationRegionName,
        start: locationStart,
        end: locationEnd
      });
      checkPromises.push(locationCheckPromise);
    }

    Promise.all(checkPromises).then((checkResults) => {
      if (isCancelled) {
        return;
      }

      const newState = {
        validationKey,
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

      setValidationResultState(newState);

      if (!newState.isMissingFocusObject && !newState.isInvalidLocation) {
        flushPostValidationQueue();
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [
    dispatch,
    flushPostValidationQueue,
    genomeId,
    focusObjectId,
    focusObjectType,
    hasMalformedLocation,
    hasFocusObjectToValidate,
    locationEnd,
    locationRegionName,
    locationStart,
    validationKey
  ]);

  useEffect(() => {
    stateRef.current = currentState;
  }, [currentState]);

  const runAfterValidation = useCallback(
    (fn: () => unknown) => {
      if (
        genomeId &&
        (!hasFocusObjectToValidate ||
          (stateRef.current.doneValidating &&
            !stateRef.current.isMissingFocusObject &&
            !stateRef.current.isInvalidLocation))
      ) {
        fn();
      } else {
        postValidationQueueRef.current.push(fn);
      }
    },
    [hasFocusObjectToValidate, genomeId]
  );

  const resetValidator = () => {
    setValidationResultState({
      validationKey,
      isMissingFocusObject: false,
      isInvalidLocation: false
    });
  };

  return {
    ...currentState,
    runAfterValidation,
    resetValidator
  };
};

const getCurrentValidationState = (params: {
  hasFocusObjectToValidate: boolean;
  validationKey: string | null;
  validationResultState: {
    validationKey: string | null;
    isMissingFocusObject: boolean;
    isInvalidLocation: boolean;
  };
}) => {
  const { hasFocusObjectToValidate, validationKey, validationResultState } =
    params;

  if (!hasFocusObjectToValidate) {
    return {
      ...initialState,
      doneValidating: true
    };
  }

  if (validationResultState.validationKey !== validationKey) {
    return {
      ...initialState,
      isValidating: true
    };
  }

  return {
    isValidating: false,
    doneValidating: true,
    isMissingFocusObject: validationResultState.isMissingFocusObject,
    isInvalidLocation: validationResultState.isInvalidLocation
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
  } else if (type === 'transcript') {
    return checkFocusTranscript(params);
  } else if (type === 'location') {
    return checkFocusLocation(params);
  } else if (type === 'variant') {
    return checkFocusVariant(params);
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
    (geneQueryError.meta.data as any)?.gene === null;

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
      end
    });
    if (locationCheckResult.isInvalidLocation) {
      isMissingFocusObject = true;
    }
  } catch {
    isMissingFocusObject = true;
  }

  return { isMissingFocusObject };
};

const checkFocusTranscript = async (params: CheckFocusObjectParams) => {
  const {
    genomeId,
    parsedFocusObjectId: { objectId: transcriptId },
    dispatch
  } = params;

  const dispatchedPromise = dispatch(
    getGBTranscriptSummary.initiate({
      genomeId,
      transcriptId
    })
  );

  const result = await dispatchedPromise;
  dispatchedPromise.unsubscribe();

  const transcriptQueryError = result.error as any;
  const isMissingTranscript =
    (result.isError &&
      transcriptQueryError &&
      'meta' in transcriptQueryError &&
      transcriptQueryError.meta?.data?.transcript === null) ||
    !result.data?.transcript;

  return {
    isMissingFocusObject: isMissingTranscript
  };
};

const checkFocusVariant = async (params: CheckFocusObjectParams) => {
  // NOTE: so far, only checking that focus variant id conforms to the following format
  // <region_name>:<start_coordinate>:<variant_name>
  const { parsedFocusObjectId } = params;
  const { objectId } = parsedFocusObjectId;

  const variantIdParts = objectId.split(':');
  // a valid id consists of three non-empty parts
  const hasValidIdParts =
    variantIdParts.length === 3 && variantIdParts.every((part) => part.length);

  if (!hasValidIdParts) {
    // expect three parts in a focus variant id
    return {
      isMissingFocusObject: true
    };
  }

  const [regionName, start, variantName] = variantIdParts; // eslint-disable-line

  // we know that at least the start coordinate must consist only of digits
  if (/\D/.test(start)) {
    return {
      isMissingFocusObject: true
    };
  }

  return {
    isMissingFocusObject: false
  };
};

type CheckLocationFromUrlParams = {
  genomeId: NonNullable<Params['genomeId']>;
  regionName: string;
  start: number;
  end: number;
};

const checkLocationFromUrl = async (params: CheckLocationFromUrlParams) => {
  const { genomeId, regionName, start, end } = params;

  let isInvalidLocation = false;

  const locationStringForValidation = `${regionName}:${start}-${end}`;
  const validationResult = await validateGenomicLocation({
    genomeId,
    location: locationStringForValidation
  });

  if (validationResult.location !== locationStringForValidation) {
    isInvalidLocation = true;
  }

  return {
    isInvalidLocation
  };
};

export default useGenomeBrowserUrlValidator;
