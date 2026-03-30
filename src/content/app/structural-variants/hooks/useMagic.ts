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

/**
 * We have some kind of function
 * It receives:
 *
 * - reference genome id
 * - alternative genome id
 * - reference location
 * - possibly alternative location?
 *
 *
 * If checking url for the first time and anternative location is present in the url
 * - should validate alternative location
 *
 * If there is no alternative location in the url
 * - Call alignments endpoint
 * - Get first alignment
 * - Get region from first alignment
 * - Call Thoas to get region's info
 *  - region length
 * - Generate initial location for the alt genome (using the algorithm from variation-alignments)
 * - Add location to url
 *
 *
 *
 * Possible outcomes
 * - alignment exists; location on alternative genome calculated successfully
 * - no alignment
 * - alternative location either has a non-existing region, or its coordinates are outside of length
 *
 */

import {
  Subject,
  distinctUntilChanged,
  of,
  from,
  concat,
  switchMap,
  scan,
  shareReplay
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

// Should import this from the package
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
  reduxDispatch: AppDispatch;
};

type StartValidatingAction = {
  type: 'start-validating';
  payload: Omit<InputParams, 'reduxDispatch'>;
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
    referenceGenome: BriefGenomeSummary;
    altGenome: BriefGenomeSummary;
  };
};

type AltGenomeLocationInvalidAction = {
  type: 'alt-genome-location-invalid';
  payload: {
    referenceGenome: BriefGenomeSummary;
    altGenome: BriefGenomeSummary;
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

type Action =
  | StartValidatingAction
  | ReferenceGenomeIdInvalidAction
  | AltGenomeIdInvalidAction
  | ReferenceGenomeLocationInvalidAction
  | AltGenomeLocationInvalidAction
  | NoAlignmentsAction
  | SuccessAction;

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
 * before it passes them for validation / alignment initial position seeking.
 * It makes sure that subsequent logic will only run if:
 * - Reference genome changes
 * - Alt genome changes
 * - Reference genome's region changes
 * - Alt genome's region changes
 */
const comparator = (previous: InputParams, current: InputParams) => {
  const prevRefGenomeId = previous.referenceGenomeId;
  const currRefGenomeId = current.referenceGenomeId;
  const prevAltGenomeId = previous.altGenomeId;
  const currAltGenomeId = current.altGenomeId;
  const prevRefGenomicLocation = previous.referenceLocationString
    ? getGenomicLocationFromString(previous.referenceLocationString)
    : null;
  const currRefGenomicLocation = current.referenceLocationString
    ? getGenomicLocationFromString(current.referenceLocationString)
    : null;
  const prevAltGenomicLocation = previous.altLocationString
    ? getGenomicLocationFromString(previous.altLocationString)
    : null;
  const currAltGenomicLocation = current.altLocationString
    ? getGenomicLocationFromString(current.altLocationString)
    : null;
  const prevRefRegionName = prevRefGenomicLocation?.regionName ?? null;
  const currRefRegionName = currRefGenomicLocation?.regionName ?? null;
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
const runFullLogic = async (params: InputParams): Promise<Action> => {
  const {
    reduxDispatch,
    referenceGenomeId,
    altGenomeId,
    referenceLocationString,
    altLocationString
  } = params;

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

  let referenceGenomeLocation: GenomicLocation;
  let altGenomeLocation: GenomicLocation | null = null;

  try {
    referenceGenomeLocation = getGenomicLocationFromString(
      referenceLocationString
    );
  } catch {
    return {
      type: 'reference-genome-location-invalid',
      payload: {
        referenceGenome,
        altGenome
      }
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
        referenceGenome,
        altGenome
      }
    };
  }

  if (altLocationString) {
    try {
      altGenomeLocation = getGenomicLocationFromString(altLocationString);
    } catch {
      return {
        type: 'alt-genome-location-invalid',
        payload: {
          referenceGenome,
          altGenome
        }
      };
    }
  } else {
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
}): Promise<GenomicLocation> => {
  const alignments = await fetchAlignments({
    referenceGenomeId,
    altGenomeId,
    referenceGenomeLocationString
  });

  const { start: referenceStart, end: referenceEnd } = referenceGenomeLocation;
  const sliceLength = referenceEnd - referenceStart;
  const firstAlignment = alignments[0];
  // FIXME: what if there aren't any alignments in that array?

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
  return fetch(url).then((response) => response.json());
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

// Getting alignments
// https://dev-2020.ensembl.org/api/structural-variants/alignments?reference_genome_id=4c07817b-c7c5-463f-8624-982286bc4355&alt_genome_id=9d3b2ead-a987-4f08-8d18-10a1eb1e0fb0&reference_viewport=13:48000001-50000000

// validation example:
// https://staging-2020.ensembl.org/api/metadata/validate_location?genome_id=9d3b2ead-a987-4f08-8d18-10a1eb1e0fb0&location=JAHEOL020000002.1:34631154-34632154

//  JAHEOL020000002.1: 34631154-34632154

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
    default:
      return state;
  }
};

const input$ = new Subject<InputParams>();

const action$ = input$.pipe(
  distinctUntilChanged(comparator),
  switchMap((input) => {
    const startValidatingAction = {
      type: 'start-validating',
      payload: input
    } as StartValidatingAction;
    return concat(of(startValidatingAction), from(runFullLogic(input)));
  })
);

const state$ = action$.pipe(scan(stateReducer, initialState), shareReplay(1));

export { state$ as validationStateObservable };

export { initialState as initialValidationState };

export const validateUrlParameters = (input: InputParams) => {
  input$.next(input);
};

export type { State as ValidationState };
