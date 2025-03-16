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

import type { OverviewRegion, GeneInRegionOverview, RegulatoryFeature } from 'src/content/app/regulatory-activity-viewer/types/regionOverview';
import type { GenomicLocation } from 'src/shared/helpers/genomicLocationHelpers';
import type { GenomeKaryotypeItem } from 'src/shared/state/genome/genomeTypes';


export const BIN_SIZE = 1_000_000; // region annotation data is stored in the state broken into "bins" of 1 megabase size for quicker access

/**
 * - See example of useSyncExternalStore:
 *   https://codesandbox.io/p/sandbox/rxjs-uses-0okvz4?file=%2Fsrc%2Findex.js
 * - Create your own redux with rxjs
 *   https://geekyants.com/blog/create-your-own-redux-with-rxjs
 */


// ============= Reading karyotype information =============

// FIXME: replace enum in loading-state.ts with this
type RequestStatus = 
  | 'not_requested'
  | 'loading'
  | 'success'
  | 'error';

type KaryotypeState = {
  status: RequestStatus;
  data: GenomeKaryotypeItem[] | null;
};

const initialKaryotypeState: KaryotypeState = {
  status: 'not_requested',
  data: null
};

const karyotypeStateSubject = new BehaviorSubject<KaryotypeState>(initialKaryotypeState);

export const karyotypeState$ = karyotypeStateSubject.asObservable();


type KaryotypeQueryParams = {
  genomeId: string;
};

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

type LocationDataQueryParams = {
  assemblyName: string;
  location: GenomicLocation;
};

type RegionQueryParams = {
  regionName: string;
  regionLength: number;
};


// =====

type RegionDetailsData = {
  assemblyName: string;
  regionName: string;
  coordinate_system: OverviewRegion['coordinate_system'];
  bins: Record<string, { // <-- using string of a format `${start}-${end}` as key
    genes: OverviewRegion['genes'];
    regulatory_features: OverviewRegion['regulatory_features']['data'];
  }>,
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

type RegionDetailsErrorAction = {
  type: 'region-details-response';
  payload: RegionDetailsData;
};

const regionDetailQueryAction$ = new Subject<RegionDetailsQueryAction>();

// FIXME:
// probably merge with karyotype query here
export const fetchRegionDetails = (params: RegionDetailsQueryAction['payload']) => {
  regionDetailQueryAction$.next({
    type: 'region-details-query',
    payload: params
  });
};

export const regionDetailsQuery$ = regionDetailQueryAction$.pipe(
  // get karyotype

  filter((action) => {
    const { assemblyName, regionName, start, end } = action.payload;
    const currentState = regionDetailsStateSubject.getValue();

    const lowerBinStart = Math.max(Math.floor(start / BIN_SIZE) * BIN_SIZE, 1);
    const upperBinEnd = Math.ceil(end / BIN_SIZE) * BIN_SIZE; // FIXME: need to know region end

    const lowerBinKey = `${lowerBinStart}-${lowerBinStart + BIN_SIZE}`; // FIXME: need to know region end
    const upperBinKey = `${Math.max(upperBinEnd - BIN_SIZE, 1)}-${upperBinEnd}`;

    // TODO: also, make sure that region details aren't already being loaded

    if (currentState.data?.assemblyName === assemblyName
      && currentState.data.regionName === regionName
      && currentState.data?.bins[lowerBinKey]
      && currentState.data?.bins[upperBinKey]
    ) {
      // region data has already been fetched and cached; no need to load again
      return false;
    }

    // will need karyotype

    return true;
  }),

  // tap to send action to update state observable?

  switchMap((action) => {
    return fetchLocation(action.payload)
      .pipe(
        // tap to send action to update state observable?
        tap((data) => {
          if ('error' in data) {
            // TODO: figure out what to do
            return;
          }

          console.log('data', data);

          // FIXME! distribute data across bins

          const { assemblyName, regionName, start, end } = action.payload;
          const binKey = `${start}-${end}`;

          const payload = {
            assemblyName: assemblyName,
            regionName: regionName,
            coordinate_system: data.coordinate_system,
            bins: {
              [binKey]: {
                genes: data.genes,
                regulatory_features: data.regulatory_features.data
              }
            },
            regulatory_feature_types: data.regulatory_features.feature_types
          };

          regionDetailsResponseAction$.next({
            type: 'region-details-response',
            payload
          });
        })
      );
  }),
).subscribe();

const regionDetailsResponseAction$ = new Subject<RegionDetailsResponseAction>();

const regionDetailsStateUpdate$ = merge(
  regionDetailQueryAction$,
  regionDetailsResponseAction$
).pipe(
  map(action => {
    const currentState = regionDetailsStateSubject.getValue();

    if (action.type === 'region-details-query') {
      const { start, end } = action.payload;

      // extract this logic to avoid duplication with same logic in the query
      const binsStart = Math.floor(start / BIN_SIZE) * BIN_SIZE + 1;
      const binsEnd = Math.ceil(end / BIN_SIZE) * BIN_SIZE; // FIXME: need to know region end

      const locationBins: string[] = [];

      for (let i = binsStart; i < binsEnd; i += BIN_SIZE) {
        const binLabel = `${i}-${i + BIN_SIZE - 1}`;
        locationBins.push(binLabel);
      }

      return mergeRegionDetailsStateOnLoading(currentState, {...action.payload, locationBins});
    }
    else if (action.type === 'region-details-response') {
      return mergeRegionDetailsState(currentState, action.payload);
    }
  })
);
regionDetailsStateUpdate$.subscribe(newState => {
  if (newState) {
    regionDetailsStateSubject.next(newState);
  }
});

const mergeRegionDetailsStateOnLoading = (
  state: RegionDetailsState,
  payload: RegionDetailsQueryAction['payload'] & { locationBins: string[] }
) => {
  const loadingLocationFromPayload = {
    assemblyName: payload.assemblyName,
    regionName: payload.regionName,
    bin: `${payload.start}-${payload.end}`
  };

  // if this is a new assembly or a new region, discard previous state
  if (!state.loadingLocations) {
    return {
      ...state,
      loadingLocations: [loadingLocationFromPayload]
    }
  }

  const isAlreadyLoadingLocation = state.loadingLocations
    .some(loc => areSameLoadingLocations(loc, loadingLocationFromPayload));

  if (isAlreadyLoadingLocation) {
    return state;
  } else {
    return {
      ...state,
      loadingLocations: [...state.loadingLocations, loadingLocationFromPayload]
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
  let loadingLocations = [ ... currentState.loadingLocations ?? [] ];

  for (const bin of Object.keys(payload.bins)) {
    if (currentState.data?.bins[bin]) {
      updatedBins[bin] = currentState.data.bins[bin];
    } else {
      updatedBins[bin] = payload.bins[bin];
    }
    loadingLocations = loadingLocations.filter(location => {
      return !(
        location.assemblyName === payload.assemblyName &&
        location.regionName === payload.regionName &&
        location.bin === bin
      )
    })
  }

  const regulatoryFeatureTypes = currentState.data
    ? { 
        ...currentState.data.regulatory_feature_types,
        ...payload.regulatory_feature_types
      }
    : payload.regulatory_feature_types;

  console.log('before return', payload, {
    loadingLocations: loadingLocations.length ? loadingLocations : null,
    data: {
      ...(currentState.data ?? {}),
      assemblyName: payload.assemblyName,
      regionName: payload.regionName,
      coordinate_system: payload.coordinate_system,
      bins: updatedBins,
      regulatory_feature_types: regulatoryFeatureTypes
    },
  })

  return {
    loadingLocations: loadingLocations.length ? loadingLocations : null,
    data: {
      ...(currentState.data ?? {}),
      assemblyName: payload.assemblyName,
      regionName: payload.regionName,
      coordinate_system: payload.coordinate_system,
      bins: updatedBins,
      regulatory_feature_types: regulatoryFeatureTypes
    },
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
  return loc1.assemblyName === loc2.assemblyName
    && loc1.regionName === loc2.regionName
    && loc1.bin === loc2.bin;
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

const regionDetailsStateSubject = new BehaviorSubject(initialRegionDetailsState);

export const regionDetailsState$ = regionDetailsStateSubject.asObservable();

export const regionDetailsStateQuery$ = new ReplaySubject<RegionDetailsQueryAction['payload']>(1);

export const dispatchRegionDetailsStateQuery = (params: RegionDetailsQueryAction['payload']) => {
  regionDetailsStateQuery$.next(params);
};

export const regionDetailsSelection$ = regionDetailsStateQuery$.pipe(
  combineLatestWith(regionDetailsState$),
  filter(([ query, state ]) => {
    console.log('IN FILTER');
    console.log(query, state);

    // FIXME: extract common logic about bins
    const binKeys: string[] = [];

    const binsStart = Math.max(Math.floor(query.start / BIN_SIZE) * BIN_SIZE, 1);
    const binsEnd = Math.ceil(query.end / BIN_SIZE) * BIN_SIZE;

    for (let i = binsStart; i < binsEnd; i += BIN_SIZE) {
      const binKey = `${i}-${i + BIN_SIZE - 1}`;
      binKeys.push(binKey);
    }

    console.log('binKeys', binKeys);

    return !!state.data &&
      query.assemblyName === state.data.assemblyName &&
      query.regionName === state.data.regionName &&
      binKeys.every(key => !!state.data!.bins[key])
  }),
  tap(() => console.log('AFTER FILTER')),

  // FIXME:
  // pass only those where region and assembly match
  // pass only those where region and assembly match
  // and only those that have all bin keys

  map(([ query, state ]) => {
    const stateData = state.data as RegionDetailsData;
    const binKeys: string[] = [];

    const binsStart = Math.max(Math.floor(query.start / BIN_SIZE) * BIN_SIZE, 1);
    const binsEnd = Math.ceil(query.end / BIN_SIZE) * BIN_SIZE;

    for (let i = binsStart; i < binsEnd; i += BIN_SIZE) {
      const binKey = `${i}-${i + BIN_SIZE}`; // FIXME: or should the end of a bin be BIN_SIZE - 1?
      binKeys.push(binKey);
    }

    const genes: GeneInRegionOverview[] = [];
    const regulatoryFeatures: RegulatoryFeature[] = [];

    for (let i = 0; i < binKeys.length; i++) {
      const key = binKeys[i];
      const bin = stateData.bins[key];

      const prevBinKey = i > 0 ? binKeys[i - 1] : null;
      const prevBinEnd = prevBinKey ? parseInt(prevBinKey.split('-').pop() as string) : null;

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
  const {
    assemblyName,
    regionName,
    start,
    end
  } = params;
  const locationForUrl = `${regionName}:${start}-${end}`;
  const endpointUrl = `${config.regulationApiBaseUrl}/region-of-interest/v0.2/assembly/${assemblyName}?location=${locationForUrl}`;

  return observableFetch<OverviewRegion>(endpointUrl);
}
