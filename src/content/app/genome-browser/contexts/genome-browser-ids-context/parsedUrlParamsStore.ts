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
  Subject,
  of,
  from,
  merge,
  concat,
  switchMap,
  map,
  scan,
  catchError,
  startWith,
  takeUntil,
  shareReplay,
  type Observable
} from 'rxjs';

import { parseFocusIdFromUrl } from 'src/shared/helpers/focusObjectHelpers';
import { getChrLocationFromStr } from 'src/content/app/genome-browser/helpers/browserHelper';
import {
  getGBRegion,
  getGBTranscriptSummary,
  getTrackPanelGene
} from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';
import { fetchGenomeSummary } from 'src/shared/state/genome/genomeApiSlice';

import type { AppDispatch } from 'src/store';
import type { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import type { BriefGenomeSummary } from 'src/shared/state/genome/genomeTypes';
import type {
  FocusObjectIdConstituents,
  UrlFocusIdConstituents
} from 'src/shared/types/focus-object/focusObjectTypes';

/**
 * The interface of this module is:
 * - A store of data collected by interpreting the url parameters.
 *   It has a "subscribe" function that the consumer can use to subscribe
 *   to state updates.
 * - The function `validateUrlParameters`, which accepts url parameters as an input
 *   and initiates validation logic, which ultimately updates the store.
 *
 * The logic is modelled as a stream of inputs (url params) that first performs
 * synchronous parsing and then switches to asynchronous validation of the parsed
 * parameters.
 *
 * The input streams are transformed into streams of "action" objects,
 * which are then used by a reducer function to update the state
 * in a manner similar to redux or react's useReducer.
 *
 * This logic relies on the rxjs library to produce the stream of inputs
 * and eventually transform it into a stream of updated states.
 */

type State = {
  isValidating: boolean;
  areUrlParamsValid: boolean;

  // Genome
  genomeIdInUrl: string | null;
  genome: BriefGenomeSummary | null;
  isMissingGenomeId: boolean;

  // Focus object
  focusObjectIdInUrl: string | null;
  parsedFocusObjectId: FocusObjectIdConstituents | null;
  isMalformedFocusObjectId: boolean;
  isMissingFocusObject: boolean;

  // Location in url
  isInvalidLocation: boolean;
  isMalformedLocation: boolean;
};

const initialState: State = {
  isValidating: false,
  areUrlParamsValid: true,

  // Genome
  genomeIdInUrl: null,
  genome: null,
  isMissingGenomeId: false,

  // Focus object
  focusObjectIdInUrl: null,
  parsedFocusObjectId: null,
  isMalformedFocusObjectId: false,
  isMissingFocusObject: false,

  // Location in url
  isInvalidLocation: false,
  isMalformedLocation: false
};

type InputParams = {
  genomeSlug: string | null;
  focusObjectUrlString: string | null;
  locationUrlString: string | null;
  reduxDispatch: AppDispatch;
};

type ParsedInputParams = InputParams & {
  parsedFocusObjectIdFromUrl: UrlFocusIdConstituents | null;
  parsedLocation: ChrLocation | null;
  isMalformedFocusObjectId: boolean;
  isMalformedLocation: boolean;
};

type StartValidatingAction = {
  type: 'start-validating';
  payload: ParsedInputParams;
};

type ValidationCompleteAction = {
  type: 'validation-complete';
  payload: State;
};

type ValidationFailedAction = {
  type: 'validation-failed';
  payload: ParsedInputParams;
};

type ResetAction = {
  type: 'reset';
};

type Action =
  | StartValidatingAction
  | ValidationCompleteAction
  | ValidationFailedAction
  | ResetAction;

const input$ = new Subject<InputParams>();
const resetAction$ = new Subject<ResetAction>();

const parseInputParams = (input: InputParams): ParsedInputParams => {
  let parsedFocusObjectIdFromUrl: UrlFocusIdConstituents | null = null;
  let parsedLocation: ChrLocation | null = null;
  let isMalformedFocusObjectId = false;
  let isMalformedLocation = false;

  if (input.focusObjectUrlString) {
    try {
      parsedFocusObjectIdFromUrl = parseFocusIdFromUrl(
        input.focusObjectUrlString
      );
      isMalformedFocusObjectId = !isSupportedFocusObjectType(
        parsedFocusObjectIdFromUrl.type
      );
    } catch {
      isMalformedFocusObjectId = true;
    }
  }

  if (input.locationUrlString) {
    try {
      parsedLocation = getChrLocationFromStr(input.locationUrlString);
    } catch {
      isMalformedLocation = true;
    }
  }

  return {
    ...input,
    parsedFocusObjectIdFromUrl,
    parsedLocation,
    isMalformedFocusObjectId,
    isMalformedLocation
  };
};

const isSupportedFocusObjectType = (type: string) => {
  return ['gene', 'transcript', 'location', 'variant'].includes(type);
};

const getBaseState = (input: ParsedInputParams): State => {
  return getStateWithComputedValidity({
    ...initialState,
    genomeIdInUrl: input.genomeSlug,
    focusObjectIdInUrl: input.focusObjectUrlString,
    isMalformedFocusObjectId: input.isMalformedFocusObjectId,
    isMalformedLocation: input.isMalformedLocation
  });
};

const getStateWithComputedValidity = (state: State): State => {
  const {
    isMissingGenomeId,
    isMalformedFocusObjectId,
    isMissingFocusObject,
    isInvalidLocation,
    isMalformedLocation
  } = state;

  return {
    ...state,
    areUrlParamsValid: !(
      isMissingGenomeId ||
      isMalformedFocusObjectId ||
      isMissingFocusObject ||
      isInvalidLocation ||
      isMalformedLocation
    )
  };
};

const runValidation = async (
  input: ParsedInputParams
): Promise<ValidationCompleteAction> => {
  const state = getBaseState(input);

  if (!input.genomeSlug) {
    return completeValidation(state);
  }

  const genome = await fetchGenome({
    genomeSlug: input.genomeSlug,
    reduxDispatch: input.reduxDispatch
  });

  if (!genome) {
    return completeValidation({
      ...state,
      isMissingGenomeId: true
    });
  }

  const nextState = {
    ...state,
    genome
  };

  if (input.parsedFocusObjectIdFromUrl && !input.isMalformedFocusObjectId) {
    nextState.parsedFocusObjectId = {
      genomeId: genome.genome_id,
      ...input.parsedFocusObjectIdFromUrl
    };
  }

  const [focusValidationResult, locationValidationResult] = await Promise.all([
    nextState.parsedFocusObjectId
      ? checkFocusObject({
          genomeId: genome.genome_id,
          parsedFocusObjectId: nextState.parsedFocusObjectId,
          reduxDispatch: input.reduxDispatch
        })
      : Promise.resolve({ isMissingFocusObject: false }),
    input.parsedLocation && !input.isMalformedLocation
      ? checkLocationFromUrl({
          genomeId: genome.genome_id,
          location: input.parsedLocation,
          reduxDispatch: input.reduxDispatch
        })
      : Promise.resolve({ isInvalidLocation: false })
  ]);

  return completeValidation({
    ...nextState,
    isMissingFocusObject: focusValidationResult.isMissingFocusObject,
    isInvalidLocation: locationValidationResult.isInvalidLocation
  });
};

const completeValidation = (state: State): ValidationCompleteAction => {
  return {
    type: 'validation-complete',
    payload: getStateWithComputedValidity({
      ...state,
      isValidating: false
    })
  };
};

const fetchGenome = async ({
  genomeSlug,
  reduxDispatch
}: {
  genomeSlug: string;
  reduxDispatch: AppDispatch;
}) => {
  const promise = reduxDispatch(
    fetchGenomeSummary.initiate(genomeSlug, { subscribe: false })
  );
  const result = await promise;
  return result.data;
};

type CheckFocusObjectParams = {
  genomeId: string;
  parsedFocusObjectId: FocusObjectIdConstituents;
  reduxDispatch: AppDispatch;
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

  return { isMissingFocusObject: true };
};

const checkFocusGene = async (params: CheckFocusObjectParams) => {
  const {
    genomeId,
    parsedFocusObjectId: { objectId: geneId },
    reduxDispatch
  } = params;

  const promise = reduxDispatch(
    getTrackPanelGene.initiate(
      {
        genomeId,
        geneId
      },
      {
        subscribe: false
      }
    )
  );
  const result = await promise;
  const isMissingGene = result.data?.gene === null;

  return {
    isMissingFocusObject: isMissingGene
  };
};

const checkFocusTranscript = async (params: CheckFocusObjectParams) => {
  const {
    genomeId,
    parsedFocusObjectId: { objectId: transcriptId },
    reduxDispatch
  } = params;

  const promise = reduxDispatch(
    getGBTranscriptSummary.initiate(
      {
        genomeId,
        transcriptId
      },
      {
        subscribe: false
      }
    )
  );
  const result = await promise;
  const isMissingTranscript = !result.data?.transcript;

  return {
    isMissingFocusObject: isMissingTranscript
  };
};

const checkFocusLocation = async (params: CheckFocusObjectParams) => {
  try {
    const location = getChrLocationFromStr(params.parsedFocusObjectId.objectId);
    const result = await checkLocationFromUrl({
      genomeId: params.genomeId,
      location,
      reduxDispatch: params.reduxDispatch
    });

    return {
      isMissingFocusObject: result.isInvalidLocation
    };
  } catch {
    return {
      isMissingFocusObject: true
    };
  }
};

const checkFocusVariant = async (params: CheckFocusObjectParams) => {
  const {
    genomeId,
    parsedFocusObjectId: { objectId },
    reduxDispatch
  } = params;

  const variantIdParts = objectId.split(':');
  const hasValidIdParts =
    variantIdParts.length === 3 && variantIdParts.every((part) => part.length);

  if (!hasValidIdParts) {
    return {
      isMissingFocusObject: true
    };
  }

  const [regionName, start] = variantIdParts;

  if (/\D/.test(start)) {
    return {
      isMissingFocusObject: true
    };
  }

  const region = await fetchRegion({
    genomeId,
    regionName,
    reduxDispatch
  });

  const startCoordinate = parseInt(start, 10);

  return {
    isMissingFocusObject:
      !region || startCoordinate < 1 || startCoordinate > region.length
  };
};

const checkLocationFromUrl = async ({
  genomeId,
  location,
  reduxDispatch
}: {
  genomeId: string;
  location: ChrLocation;
  reduxDispatch: AppDispatch;
}) => {
  const [regionName, start, end] = location;
  const region = await fetchRegion({
    genomeId,
    regionName,
    reduxDispatch
  });

  return {
    isInvalidLocation:
      !region ||
      start < 1 ||
      end < 1 ||
      start >= end ||
      start > region.length ||
      end > region.length
  };
};

const fetchRegion = async ({
  genomeId,
  regionName,
  reduxDispatch
}: {
  genomeId: string;
  regionName: string;
  reduxDispatch: AppDispatch;
}) => {
  const promise = reduxDispatch(
    getGBRegion.initiate(
      {
        genomeId,
        regionName
      },
      { subscribe: false }
    )
  );
  const result = await promise;

  return result.data?.region ?? null;
};

const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'start-validating':
      return getStateWithComputedValidity({
        ...getBaseState(action.payload),
        isValidating: true
      });
    case 'validation-complete':
      return action.payload;
    case 'validation-failed':
      return {
        ...getBaseState(action.payload),
        isValidating: false,
        areUrlParamsValid: false
      };
    case 'reset':
      return initialState;
    default:
      return state;
  }
};

const validationAction$: Observable<Action> = input$.pipe(
  map(parseInputParams),
  switchMap((input) => {
    const startValidatingAction = {
      type: 'start-validating',
      payload: input
    } as StartValidatingAction;

    return concat(
      of(startValidatingAction),
      from(runValidation(input)).pipe(
        catchError(() =>
          of({
            type: 'validation-failed',
            payload: input
          } as ValidationFailedAction)
        )
      )
    ).pipe(takeUntil(resetAction$));
  })
);

const action$: Observable<Action> = merge(validationAction$, resetAction$);

const state$ = action$.pipe(
  startWith({ type: 'reset' } as const),
  scan(stateReducer, initialState),
  shareReplay(1)
);

export const validateUrlParameters = (input: InputParams) => {
  input$.next(input);
};

export const resetParsedParameters = () => {
  resetAction$.next({ type: 'reset' });
};

export type { State as ValidationState, InputParams };

export class Store {
  static #snapshot: State = initialState;

  static {
    state$.subscribe((state) => {
      this.#snapshot = state;
    });
  }

  static subscribe = (fn: (state: State) => void) => {
    const subscription = state$.subscribe((state) => {
      fn(state);
    });
    return () => subscription.unsubscribe();
  };

  static getSnapshot = () => {
    return this.#snapshot;
  };
}
