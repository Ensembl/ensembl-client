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
  pairwise,
  partition,
  switchMap,
  map,
  filter,
  scan,
  startWith,
  shareReplay,
  type Observable
} from 'rxjs';

import config from 'config';

import {
  getGenomicLocationFromString,
  getGenomicLocationString,
  type GenomicLocation
} from 'src/shared/helpers/genomicLocationHelpers';

import {
  genomeGroupsEndpoint,
  genomesInGroupEndpoint
} from 'src/content/app/structural-variants/state/api/structuralVariantsApiSlice';
import { getGBRegion } from 'src/content/app/genome-browser/state/api/genomeBrowserApiSlice';

import type { AppDispatch } from 'src/store';
import type { BriefGenomeSummary } from 'src/shared/state/genome/genomeTypes';

/**
 * The interface of this module is:
 * - A store of data collected by interpreting the url parameters.
 *   This has a "subscribe" function that the consumer can use to subscribe
 *   to state updates.
 * - The function `validateUrlParameters`, which accepts url parameters as an input
 *   and eventually will result in a state update.
 *
 * The logic is modelled as a stream of inputs that is split into a stream
 * of inputs that need asynchronous data validation and discovery of the initial location
 * on the alternative genome, and a stream of inputs that do not need any validation
 * (i.e. when genomes and region names have not changed since previous input).
 *
 * The input streams are transformed into streams of "action" objects,
 * which are then used by a reducer function to update the state
 * in a manner similar to redux or react's useReducer.
 *
 * This logic relies on the rxjs library to produce the stream of inputs
 * and eventually transform it into a stream of updated states.
 */

type Alignment = {
  reference: {
    region_name: string;
    start: number;
    length: number;
    strand: 'forward' | 'reverse';
  };
  alt: {
    region_name: string;
    start: number;
    length: number;
    strand: 'forward' | 'reverse';
  };
  id: string;
};

type State = {
  isValidating: boolean;
  areUrlParamsValid: boolean;
  isReferenceGenomeIdValid: boolean;
  isAltGenomeIdValid: boolean;
  referenceGenomeId: string | null;
  altGenomeId: string | null;
  referenceGenome: BriefGenomeSummary | null;
  altGenome: BriefGenomeSummary | null;
  referenceGenomeLocationString: string | null;
  altGenomeLocationString: string | null;
  referenceGenomeLocation: GenomicLocation | null;
  altGenomeLocation: GenomicLocation | null;
  isReferenceGenomeLocationValid: boolean;
  isAltGenomeLocationValid: boolean;
  referenceRegionLength: number | null;
  altRegionLength: number | null;
  hasNoAlignments: boolean;
};

type InputParams = {
  referenceGenomeId: string;
  altGenomeId: string;
  referenceLocationString: string;
  altLocationString: string | null;
  reduxDispatch: AppDispatch; // to make http requests using redux-toolkit-query, which provides caching
};

type InputParamsWithParsedLocation = {
  referenceGenomeId: string;
  altGenomeId: string;
  referenceLocationString: string;
  altLocationString: string | null;
  referenceGenomeLocation: GenomicLocation;
  altGenomeLocation: GenomicLocation | null;
  reduxDispatch: AppDispatch;
};

type StartValidatingAction = {
  type: 'start-validating';
  payload: Omit<InputParamsWithParsedLocation, 'reduxDispatch'>;
};

type ReferenceGenomeIdInvalidAction = {
  type: 'reference-genome-id-invalid';
  payload: {
    genomeId: string;
  };
};

type AltGenomeIdInvalidAction = {
  type: 'alt-genome-id-invalid';
  payload: {
    genomeId: string;
  };
};

type ReferenceGenomeLocationInvalidAction = {
  type: 'reference-genome-location-invalid';
  payload: {
    referenceGenomeLocationString: string;
    referenceGenome?: BriefGenomeSummary;
    altGenome?: BriefGenomeSummary;
  };
};

type AltGenomeLocationInvalidAction = {
  type: 'alt-genome-location-invalid';
  payload: {
    altGenomeLocationString: string;
    referenceGenome?: BriefGenomeSummary;
    altGenome?: BriefGenomeSummary;
  };
};

type NoAlignmentsAction = {
  type: 'no-alignments';
  payload: {
    referenceGenome: BriefGenomeSummary;
    altGenome: BriefGenomeSummary;
    referenceGenomeLocation: GenomicLocation;
  };
};

type SuccessAction = {
  type: 'success';
  payload: {
    referenceGenomeId: string;
    referenceGenome: BriefGenomeSummary;
    referenceGenomeLocationString: string;
    referenceGenomeLocation: GenomicLocation;
    altGenomeId: string;
    altGenome: BriefGenomeSummary;
    altGenomeLocationString: string;
    altGenomeLocation: GenomicLocation;
    referenceRegionLength: number;
    altRegionLength: number;
  };
};

// This action is used to directly update reference and alt genome's locations
// without going through validation
type UpdateLocationAction = {
  type: 'update-location';
  payload: {
    referenceGenomeLocationString: string;
    referenceGenomeLocation: GenomicLocation;
    altGenomeLocationString: string;
    altGenomeLocation: GenomicLocation;
  };
};

type ResetAction = {
  type: 'reset';
};

type Action =
  | StartValidatingAction
  | ReferenceGenomeIdInvalidAction
  | AltGenomeIdInvalidAction
  | ReferenceGenomeLocationInvalidAction
  | AltGenomeLocationInvalidAction
  | NoAlignmentsAction
  | SuccessAction
  | UpdateLocationAction
  | ResetAction;

const initialState: State = {
  isValidating: false,
  areUrlParamsValid: true,
  isReferenceGenomeIdValid: true,
  isAltGenomeIdValid: true,
  referenceGenomeId: null,
  altGenomeId: null,
  referenceGenome: null,
  altGenome: null,
  referenceGenomeLocationString: null,
  altGenomeLocationString: null,
  referenceGenomeLocation: null,
  altGenomeLocation: null,
  isReferenceGenomeLocationValid: true,
  isAltGenomeLocationValid: true,
  referenceRegionLength: null,
  altRegionLength: null,
  hasNoAlignments: false
};

/**
 * This is the function that checks input parameters
 * to decide whether to perform async validation of the parameters
 * and the search of appropriate location on the alternative genome.
 * It makes sure that the validation and the position seeking will only occur if:
 * - Reference genome changes
 * - Alt genome changes
 * - Reference genome's region changes
 * - Alt genome's region changes
 */
const canSkipValidation = (
  previous: InputParamsWithParsedLocation,
  current: InputParamsWithParsedLocation
) => {
  const prevRefGenomeId = previous.referenceGenomeId;
  const currRefGenomeId = current.referenceGenomeId;
  const prevAltGenomeId = previous.altGenomeId;
  const currAltGenomeId = current.altGenomeId;
  const prevRefGenomicLocation = previous.referenceGenomeLocation;
  const currRefGenomicLocation = current.referenceGenomeLocation;
  const prevAltGenomicLocation = previous.altGenomeLocation;
  const currAltGenomicLocation = current.altGenomeLocation;
  const prevRefRegionName = prevRefGenomicLocation.regionName;
  const currRefRegionName = currRefGenomicLocation.regionName;
  const prevAltRegionName = prevAltGenomicLocation?.regionName ?? null;
  const currAltRegionName = currAltGenomicLocation?.regionName ?? null;

  // If all comparisons below are true,
  // then there is no need to run validations on url parameters
  // or to look for initial coordinates on alt genome's region
  return (
    prevRefGenomeId === currRefGenomeId &&
    prevAltGenomeId === currAltGenomeId &&
    prevRefRegionName === currRefRegionName &&
    prevAltRegionName === currAltRegionName
  );
};

/**
 * - Check that a reference genome with provided id exists in one of the genome groups
 * - Check that a genome with provided alt id exists among other genomes of that group
 * - Check that reference genome's region exists and that location is within it
 * - If params include location in alternative genome, check that this region exists and that location is within it
 */
const runFullLogic = async (
  params: InputParamsWithParsedLocation
): Promise<Action> => {
  const {
    reduxDispatch,
    referenceGenomeId,
    altGenomeId,
    referenceLocationString,
    altLocationString,
    referenceGenomeLocation
  } = params;
  let { altGenomeLocation } = params;

  const genomeGroups = await fetchGenomeGroups({
    reduxDispatch: params.reduxDispatch
  });
  const referenceGroup = genomeGroups?.find(
    (group) => group.reference_genome.genome_id === referenceGenomeId
  );

  if (!referenceGroup) {
    return {
      type: 'reference-genome-id-invalid',
      payload: { genomeId: referenceGenomeId }
    };
  }

  const referenceGenome = referenceGroup.reference_genome;

  const genomesInGroup = await fetchGenomesInGroup({
    reduxDispatch,
    groupId: referenceGroup.id
  });
  const altGenome = genomesInGroup?.genomes.find(
    (genome) => genome.genome_id === altGenomeId
  );

  if (!altGenome) {
    return {
      type: 'alt-genome-id-invalid',
      payload: { genomeId: altGenomeId }
    };
  }

  const referenceRegion = await fetchRegion({
    reduxDispatch,
    genomeId: referenceGenomeId,
    regionName: referenceGenomeLocation.regionName
  });

  if (
    !referenceRegion ||
    !isGenomicLocationValid({
      region: referenceRegion,
      genomicLocation: referenceGenomeLocation
    })
  ) {
    return {
      type: 'reference-genome-location-invalid',
      payload: {
        referenceGenomeLocationString: referenceLocationString,
        referenceGenome,
        altGenome
      }
    };
  }

  if (!altGenomeLocation) {
    altGenomeLocation = await getInitialAltLocation({
      referenceGenomeId,
      altGenomeId,
      referenceGenomeLocation,
      referenceGenomeLocationString: referenceLocationString
    });
  }

  if (altGenomeLocation) {
    const altRegion = await fetchRegion({
      genomeId: altGenomeId,
      regionName: altGenomeLocation.regionName,
      reduxDispatch
    });

    if (
      altRegion &&
      isGenomicLocationValid({
        region: altRegion,
        genomicLocation: altGenomeLocation
      })
    ) {
      // all parameters have resolved successfully; hooray!
      return {
        type: 'success',
        payload: {
          referenceGenomeId,
          altGenomeId,
          referenceGenome,
          altGenome,
          referenceGenomeLocation,
          altGenomeLocation,
          referenceGenomeLocationString: referenceLocationString,
          altGenomeLocationString:
            altLocationString ?? getGenomicLocationString(altGenomeLocation),
          referenceRegionLength: referenceRegion.length,
          altRegionLength: altRegion.length
        }
      };
    } else {
      return {
        type: 'alt-genome-location-invalid',
        payload: {
          altGenomeLocationString:
            altLocationString ?? getGenomicLocationString(altGenomeLocation),
          referenceGenome,
          altGenome
        }
      };
    }
  } else {
    return {
      type: 'no-alignments',
      payload: {
        referenceGenome,
        altGenome,
        referenceGenomeLocation
      }
    };
  }
};

/**
 * The logic is modified from ensembl-elements structural variants package.
 * Its purpose is to turn the first alignment into a rectangle,
 * (meaning that the length of the sequence from the start coordinate
 * to the end of the alignment is exactly the same on the reference and on the alternative genome.
 * This should make genomic features within the viewport more or less aligned with each other.
 * The logic goes as follows:
 * - Take the first alignment
 * - Find the distance between the end of that alignment on the reference genome
 *   and the start viewport coordinate on reference genome (i.e. start reference genome location)
 * - Subtract same distance from the end of the alignment on the alternative genome
 * - Set the resulting coordinate to be the start coordinate on the alternative genome
 */
const getInitialAltLocation = async ({
  referenceGenomeId,
  altGenomeId,
  referenceGenomeLocation,
  referenceGenomeLocationString
}: {
  referenceGenomeId: string;
  referenceGenomeLocation: GenomicLocation;
  referenceGenomeLocationString: string;
  altGenomeId: string;
}): Promise<GenomicLocation | null> => {
  const alignments = await fetchAlignments({
    referenceGenomeId,
    altGenomeId,
    referenceGenomeLocationString
  });

  const { start: referenceStart, end: referenceEnd } = referenceGenomeLocation;
  const sliceLength = referenceEnd - referenceStart;
  const firstAlignment = alignments[0];

  if (!firstAlignment) {
    return null;
  }

  const alignmentRefEnd =
    firstAlignment.reference.start + firstAlignment.reference.length - 1;
  const alignmentRefDistanceFromStart = alignmentRefEnd - referenceStart;

  const alignmentAltEnd =
    firstAlignment.alt.start + firstAlignment.alt.length - 1;
  const altStart = alignmentAltEnd - alignmentRefDistanceFromStart;
  const altEnd = altStart + sliceLength;
  const altRegionName = firstAlignment.alt.region_name;

  return {
    regionName: altRegionName,
    start: altStart,
    end: altEnd
  };
};

const fetchGenomeGroups = async ({
  reduxDispatch
}: {
  reduxDispatch: AppDispatch;
}) => {
  const promise = reduxDispatch(genomeGroupsEndpoint.initiate());
  const result = await promise;
  const { data } = result;

  promise.unsubscribe();

  if (data) {
    return data.genome_groups;
  }
};

const fetchGenomesInGroup = async ({
  groupId,
  reduxDispatch
}: {
  groupId: string;
  reduxDispatch: AppDispatch;
}) => {
  const promise = reduxDispatch(genomesInGroupEndpoint.initiate(groupId));
  const result = await promise;
  const { data } = result;

  promise.unsubscribe();

  if (data) {
    return data;
  }
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
  const promise = reduxDispatch(getGBRegion.initiate({ genomeId, regionName }));
  const result = await promise;
  promise.unsubscribe();

  const { data } = result;

  if (data?.region) {
    return data.region;
  }
};

const fetchAlignments = async ({
  referenceGenomeId,
  altGenomeId,
  referenceGenomeLocationString
}: {
  referenceGenomeId: string;
  referenceGenomeLocationString: string;
  altGenomeId: string;
}): Promise<Alignment[]> => {
  const urlPath = `${config.structuralVariantsApiBaseUrl}/alignments`;
  const queryParams = new URLSearchParams();
  queryParams.set('reference_genome_id', referenceGenomeId);
  queryParams.set('reference_viewport', referenceGenomeLocationString);
  queryParams.set('alt_genome_id', altGenomeId);
  const url = `${urlPath}?${queryParams.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error();
    }
    const alignments = await response.json();
    return alignments;
  } catch {
    return [];
  }
};

const isGenomicLocationValid = ({
  genomicLocation,
  region
}: {
  genomicLocation: GenomicLocation;
  region: { length: number };
}) => {
  return (
    genomicLocation.start < genomicLocation.end &&
    genomicLocation.end <= region.length
  );
};

const stateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'start-validating':
      return {
        ...initialState,
        isValidating: true,
        referenceGenomeId: action.payload.referenceGenomeId,
        altGenomeId: action.payload.altGenomeId,
        referenceGenomeLocationString: action.payload.referenceLocationString,
        altGenomeLocationString: action.payload.altLocationString
      };
    case 'reference-genome-id-invalid':
      return {
        ...state,
        isValidating: false,
        isReferenceGenomeIdValid: false
      };
    case 'reference-genome-location-invalid':
      return {
        ...state,
        ...action.payload,
        isValidating: false,
        isReferenceGenomeLocationValid: false
      };
    case 'alt-genome-id-invalid':
      return {
        ...state,
        isValidating: false,
        isAltGenomeIdValid: false
      };
    case 'alt-genome-location-invalid':
      return {
        ...state,
        ...action.payload,
        isValidating: false,
        isAltGenomeLocationValid: false
      };
    case 'no-alignments':
      return {
        ...state,
        ...action.payload,
        isValidating: false,
        hasNoAlignments: true
      };
    case 'success':
      return {
        ...state,
        ...action.payload,
        isValidating: false
      };
    case 'update-location':
      return {
        ...state,
        ...action.payload
      };
    case 'reset':
      return initialState;
    default:
      return state;
  }
};

const input$ = new Subject<InputParams>();

// First step of validation: make sure that location parameters from the url can be parsed
const inputWithParsedLocation$: Observable<
  | { isOk: true; payload: InputParamsWithParsedLocation }
  | {
      isOk: false;
      action:
        | ReferenceGenomeLocationInvalidAction
        | AltGenomeLocationInvalidAction;
    }
> = input$.pipe(
  map((input) => {
    const { referenceLocationString, altLocationString } = input;
    let referenceGenomeLocation: GenomicLocation;
    let altGenomeLocation: GenomicLocation | null = null;

    try {
      referenceGenomeLocation = getGenomicLocationFromString(
        referenceLocationString
      );
    } catch {
      const action = {
        type: 'reference-genome-location-invalid',
        payload: {
          referenceGenomeLocationString: referenceLocationString
        }
      } as ReferenceGenomeLocationInvalidAction;
      return {
        isOk: false,
        action
      };
    }
    try {
      if (altLocationString) {
        altGenomeLocation = getGenomicLocationFromString(altLocationString);
      }
    } catch {
      const action = {
        type: 'alt-genome-location-invalid',
        payload: {
          altGenomeLocationString: altLocationString
        }
      } as AltGenomeLocationInvalidAction;
      return {
        isOk: false,
        action
      };
    }

    return {
      isOk: true,
      payload: {
        referenceGenomeId: input.referenceGenomeId,
        altGenomeId: input.altGenomeId,
        referenceLocationString,
        altLocationString,
        referenceGenomeLocation,
        altGenomeLocation,
        reduxDispatch: input.reduxDispatch
      }
    };
  })
);

const [goodInput$, badInput$] = partition(inputWithParsedLocation$, (input) => {
  return input.isOk;
});

const pairwiseInput$ = goodInput$.pipe(
  map(({ payload }) => payload),
  startWith(null),
  pairwise()
);

const [inputForValidation$, inputNoValidation$] = partition(
  pairwiseInput$,
  ([prevInput, currentInput]) => {
    if (!prevInput || !currentInput) {
      return true;
    }
    return !canSkipValidation(prevInput, currentInput);
  }
);

const actionAfterValidation$ = inputForValidation$.pipe(
  map(([, currentInput]) => currentInput as InputParamsWithParsedLocation),
  switchMap((input) => {
    const startValidatingAction = {
      type: 'start-validating',
      payload: input
    } as StartValidatingAction;
    return concat(of(startValidatingAction), from(runFullLogic(input)));
  })
);

const actionWithoutValidation$ = inputNoValidation$.pipe(
  map(([, currentInput]) => {
    const { referenceLocationString, altLocationString } =
      currentInput as InputParamsWithParsedLocation;
    let referenceLocation: GenomicLocation;
    let altLocation: GenomicLocation;
    try {
      referenceLocation = getGenomicLocationFromString(referenceLocationString);
      altLocation = getGenomicLocationFromString(altLocationString as string);

      return {
        type: 'update-location',
        payload: {
          referenceGenomeLocationString: referenceLocationString as string,
          referenceGenomeLocation: referenceLocation,
          altGenomeLocationString: altLocationString as string,
          altGenomeLocation: altLocation
        }
      } as UpdateLocationAction;
    } catch {
      return null;
    }
  }),
  filter((action) => Boolean(action))
);

const invalidLocationInInputAction$ = badInput$.pipe(
  map(({ action }) => action)
);

const resetAction$ = new Subject<ResetAction>();

const action$ = merge(
  invalidLocationInInputAction$,
  actionAfterValidation$,
  actionWithoutValidation$ as Observable<UpdateLocationAction>,
  resetAction$
);

const state$ = action$.pipe(scan(stateReducer, initialState), shareReplay(1));

export const validateUrlParameters = (input: InputParams) => {
  input$.next(input);
};

export const resetParsedParameters = () => {
  resetAction$.next({ type: 'reset' });
};

export type { State as ValidationState };

export class Store {
  static #snapshot: State = initialState;

  // initialisation block
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
