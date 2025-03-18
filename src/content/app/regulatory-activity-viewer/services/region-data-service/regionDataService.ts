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
  BehaviorSubject,
  ReplaySubject,
  merge,
  map,
  filter,
  switchMap,
  tap,
  combineLatestWith
} from 'rxjs';

import config from 'config';

import { fetch as observableFetch } from 'src/services/observable-api-service';
import {
  createBins,
  createBinKey,
  getBinStartForPosition,
  getBinEndForPosition,
  BIN_SIZE
} from './binsHelper';

import type {
  OverviewRegion,
  GeneInRegionOverview,
  RegulatoryFeature
} from 'src/content/app/regulatory-activity-viewer/types/regionOverview';
import type { GenomeKaryotypeItem } from 'src/shared/state/genome/genomeTypes';

/**
 * - See example of useSyncExternalStore:
 *   https://codesandbox.io/p/sandbox/rxjs-uses-0okvz4?file=%2Fsrc%2Findex.js
 * - Create your own redux with rxjs
 *   https://geekyants.com/blog/create-your-own-redux-with-rxjs
 */

// ============= Reading karyotype information =============

// FIXME: replace enum in loading-state.ts with this
type RequestStatus = 'not_requested' | 'loading' | 'success' | 'error';

type KaryotypeState = {
  status: RequestStatus;
  data: GenomeKaryotypeItem[] | null;
};

const initialKaryotypeState: KaryotypeState = {
  status: 'not_requested',
  data: null
};

const karyotypeStateSubject = new BehaviorSubject<KaryotypeState>(
  initialKaryotypeState
);

export const karyotypeState$ = karyotypeStateSubject.asObservable();

// const karyotype

// =========================================================

/**
 * This is a service for fetching data to display in region overview panel.
 *
 * LOCATION DATA STREAM
 *
 *
 * FULL REGION DATA STREAM
 *
 */

// =====

type RegionDetailsData = {
  assemblyName: string;
  regionName: string;
  coordinate_system: OverviewRegion['coordinate_system'];
  bins: Record<
    string,
    {
      // <-- using string of a format `${start}-${end}` as key
      genes: OverviewRegion['genes'];
      regulatory_features: OverviewRegion['regulatory_features']['data'];
    }
  >;
  regulatory_feature_types: OverviewRegion['regulatory_features']['feature_types'];
};

type RegionDetailsQueryAction = {
  type: 'region-details-query';
  payload: {
    assemblyName: string;
    regionName: string;
    start: number;
    end: number;
  };
};

type RegionDetailsResponseAction = {
  type: 'region-details-response';
  payload: RegionDetailsData;
};

// FIXME: account for errors
// type RegionDetailsErrorAction = {
//   type: 'region-details-response';
//   payload: RegionDetailsData;
// };

const regionDetailQueryAction$ = new Subject<RegionDetailsQueryAction>();

// FIXME:
// probably merge with karyotype query here
export const fetchRegionDetails = (
  params: RegionDetailsQueryAction['payload']
) => {
  regionDetailQueryAction$.next({
    type: 'region-details-query',
    payload: params
  });
};

export const regionDetailsQuery$ = regionDetailQueryAction$
  .pipe(
    // get karyotype

    filter((action) => {
      const { assemblyName, regionName, start, end } = action.payload;
      const currentState = regionDetailsStateSubject.getValue();

      const lowerBinStart = Math.max(
        Math.floor(start / BIN_SIZE) * BIN_SIZE,
        1
      );
      const upperBinEnd = Math.ceil(end / BIN_SIZE) * BIN_SIZE; // FIXME: need to know region end

      const lowerBinKey = `${lowerBinStart}-${lowerBinStart + BIN_SIZE}`; // FIXME: need to know region end
      const upperBinKey = `${Math.max(upperBinEnd - BIN_SIZE, 1)}-${upperBinEnd}`;

      // TODO: also, make sure that region details aren't already being loaded

      if (
        currentState.data?.assemblyName === assemblyName &&
        currentState.data.regionName === regionName &&
        currentState.data.bins[lowerBinKey] &&
        currentState.data.bins[upperBinKey]
      ) {
        // region data has already been fetched and cached; no need to load again
        return false;
      }

      // will need karyotype

      return true;
    }),

    // tap to send action to update state observable?

    switchMap((action) => {
      return fetchLocation(action.payload).pipe(
        // tap to send action to update state observable?
        tap((data) => {
          if ('error' in data) {
            // TODO: figure out what to do
            return;
          }

          const { assemblyName, regionName } = action.payload;

          const payload = {
            assemblyName: assemblyName,
            regionName: regionName,
            coordinate_system: data.coordinate_system,
            bins: distributeAcrossBins({
              requestParams: action.payload,
              response: data
            }),
            regulatory_feature_types: data.regulatory_features.feature_types
          };

          regionDetailsResponseAction$.next({
            type: 'region-details-response',
            payload
          });
        })
      );
    })
  )
  .subscribe();

const distributeAcrossBins = ({
  requestParams,
  response
}: {
  requestParams: RegionDetailsQueryAction['payload'];
  response: OverviewRegion;
}) => {
  const { start, end } = requestParams;
  const {
    genes,
    regulatory_features: { data: regulatoryFeatures }
  } = response;

  const bins = createBins({ start, end });
  const binsMap = bins.reduce(
    (obj, { start, end }) => {
      const key = `${start}-${end}`;
      obj[key] = { genes: [], regulatory_features: [] };
      return obj;
    },
    {} as RegionDetailsData['bins']
  );

  let geneIndex = 0;
  let regFeatureIndex = 0;

  for (const bin of bins) {
    const binKey = `${bin.start}-${bin.end}`;

    for (let i = geneIndex; i < genes.length; i++) {
      const gene = genes[i];
      if (gene.start < bin.end) {
        binsMap[binKey].genes.push(gene);
      } else {
        break;
      }
      if (gene.end < bin.end) {
        geneIndex++;
      }
    }

    for (let i = regFeatureIndex; i < regulatoryFeatures.length; i++) {
      const regFeature = regulatoryFeatures[i];

      if (regFeature.start < bin.end) {
        binsMap[binKey].regulatory_features.push(regFeature);
      } else {
        break;
      }
      if (regFeature.end < bin.end) {
        regFeatureIndex++;
      }
    }
  }

  return binsMap;
};

const regionDetailsResponseAction$ = new Subject<RegionDetailsResponseAction>();

const regionDetailsStateUpdate$ = merge(
  regionDetailQueryAction$,
  regionDetailsResponseAction$
).pipe(
  map((action) => {
    const currentState = regionDetailsStateSubject.getValue();

    if (action.type === 'region-details-query') {
      const { start, end } = action.payload;

      const binsStart = getBinStartForPosition(start);
      const binsEnd = getBinEndForPosition(end);

      const binKeys = createBins({
        start: binsStart,
        end: binsEnd
      }).map(createBinKey);

      return mergeRegionDetailsStateOnLoading(currentState, {
        ...action.payload,
        binKeys
      });
    } else if (action.type === 'region-details-response') {
      return mergeRegionDetailsState(currentState, action.payload);
    }
  })
);
regionDetailsStateUpdate$.subscribe((newState) => {
  if (newState) {
    regionDetailsStateSubject.next(newState);
  }
});

const mergeRegionDetailsStateOnLoading = (
  state: RegionDetailsState,
  payload: RegionDetailsQueryAction['payload'] & { binKeys: string[] }
) => {
  const loadingLocations = payload.binKeys.map((binKey) => ({
    assemblyName: payload.assemblyName,
    regionName: payload.regionName,
    bin: binKey
  }));

  // if this is a new assembly or a new region, discard previous state
  if (!state.loadingLocations) {
    return {
      ...state,
      loadingLocations
    };
  }

  const isAlreadyLoadingLocation = state.loadingLocations.some((loc) => {
    return loadingLocations.some((locFromPayload) =>
      areSameLoadingLocations(locFromPayload, loc)
    );
  });

  if (isAlreadyLoadingLocation) {
    return state;
  } else {
    return {
      ...state,
      loadingLocations: [...state.loadingLocations, ...loadingLocations]
    };
  }
};

const mergeRegionDetailsState = (
  currentState: RegionDetailsState,
  payload: RegionDetailsResponseAction['payload']
) => {
  // remove the locations in payload from the loading list
  // if location does not exist among the state bins
  // add the bins
  const updatedBins: RegionDetailsData['bins'] = {};
  let loadingLocations = [...(currentState.loadingLocations ?? [])];

  for (const bin of Object.keys(payload.bins)) {
    if (currentState.data?.bins[bin]) {
      updatedBins[bin] = currentState.data.bins[bin];
    } else {
      updatedBins[bin] = payload.bins[bin];
    }
    loadingLocations = loadingLocations.filter((location) => {
      return !(
        location.assemblyName === payload.assemblyName &&
        location.regionName === payload.regionName &&
        location.bin === bin
      );
    });
  }

  const regulatoryFeatureTypes = currentState.data
    ? {
        ...currentState.data.regulatory_feature_types,
        ...payload.regulatory_feature_types
      }
    : payload.regulatory_feature_types;

  return {
    loadingLocations: loadingLocations.length ? loadingLocations : null,
    data: {
      ...(currentState.data ?? {}),
      assemblyName: payload.assemblyName,
      regionName: payload.regionName,
      coordinate_system: payload.coordinate_system,
      bins: updatedBins,
      regulatory_feature_types: regulatoryFeatureTypes
    }
  };

  // assemblyName: string;
  // regionName: string;
  // coordinate_system: OverviewRegion['coordinate_system'];
  // bins: Record<string, { // <-- using string of a format `${start}-${end}` as key
  //   genes: OverviewRegion['genes'];
  //   regulatory_features: OverviewRegion['regulatory_features']['data'];
  // }>,
  // regulatory_feature_types: OverviewRegion['regulatory_features']['feature_types'];
};

const areSameLoadingLocations = (
  loc1: LoadingLocation,
  loc2: LoadingLocation
) => {
  return (
    loc1.assemblyName === loc2.assemblyName &&
    loc1.regionName === loc2.regionName &&
    loc1.bin === loc2.bin
  );
};

type LoadingLocation = {
  assemblyName: string;
  regionName: string;
  bin: string;
};

type RegionDetailsState = {
  data: RegionDetailsData | null;
  loadingLocations: LoadingLocation[] | null;
  // TODO: think of errors
  // status: RegionDetailsStatus;
};

const initialRegionDetailsState: RegionDetailsState = {
  loadingLocations: null,
  data: null
};

const regionDetailsStateSubject = new BehaviorSubject(
  initialRegionDetailsState
);

export const regionDetailsState$ = regionDetailsStateSubject.asObservable();

export const regionDetailsStateQuery$ = new ReplaySubject<
  RegionDetailsQueryAction['payload']
>(1);

export const dispatchRegionDetailsStateQuery = (
  params: RegionDetailsQueryAction['payload']
) => {
  regionDetailsStateQuery$.next(params);
};

export const regionDetailsSelection$ = regionDetailsStateQuery$.pipe(
  combineLatestWith(regionDetailsState$),
  filter(([query, state]) => {
    const binKeys = createBins({
      start: query.start,
      end: query.end
    }).map(createBinKey);

    return (
      !!state.data &&
      query.assemblyName === state.data.assemblyName &&
      query.regionName === state.data.regionName &&
      binKeys.every((key) => !!state.data!.bins[key])
    );
  }),

  // FIXME:
  // pass only those where region and assembly match
  // pass only those where region and assembly match
  // and only those that have all bin keys

  map(([query, state]) => {
    const stateData = state.data as RegionDetailsData;
    const binKeys: string[] = [];

    const binsStart = Math.max(
      Math.floor(query.start / BIN_SIZE) * BIN_SIZE,
      1
    );
    const binsEnd = Math.ceil(query.end / BIN_SIZE) * BIN_SIZE;

    for (let i = binsStart; i < binsEnd; i += BIN_SIZE) {
      const binKey = `${i}-${i + BIN_SIZE - 1}`;
      binKeys.push(binKey);
    }

    const genes: GeneInRegionOverview[] = [];
    const regulatoryFeatures: RegulatoryFeature[] = [];

    for (let i = 0; i < binKeys.length; i++) {
      const key = binKeys[i];
      const bin = stateData.bins[key];

      const prevBinKey = i > 0 ? binKeys[i - 1] : null;
      const prevBinEnd = prevBinKey
        ? parseInt(prevBinKey.split('-').pop() as string)
        : null;

      for (const gene of bin.genes) {
        if (prevBinEnd && gene.start <= prevBinEnd) {
          continue;
        } else {
          genes.push(gene);
        }
      }

      for (const regFeature of bin.regulatory_features) {
        if (prevBinEnd && regFeature.start <= prevBinEnd) {
          continue;
        } else {
          regulatoryFeatures.push(regFeature);
        }
      }
    }

    return {
      assemblyName: stateData.assemblyName,
      regionName: stateData.regionName,
      genes,
      regulatory_features: {
        feature_types: stateData.regulatory_feature_types,
        data: regulatoryFeatures
      }
    };
  })
);

// =====

// const locationQuery$ = new Subject<LocationDataQueryParams>();

// const regionQuery$ = new Subject<RegionQueryParams>();

// export const queryLocation = (location: LocationDataQueryParams) => {
//   locationQuery$.next(location);
// };

// const regionLocationData$ = locationQuery$.pipe(
//   switchMap()
// );

const fetchLocation = (params: RegionDetailsQueryAction['payload']) => {
  const { assemblyName, regionName, start, end } = params;
  const locationForUrl = `${regionName}:${start}-${end}`;
  const endpointUrl = `${config.regulationApiBaseUrl}/region-of-interest/v0.2/assembly/${assemblyName}?location=${locationForUrl}`;

  return observableFetch<OverviewRegion>(endpointUrl);
};
