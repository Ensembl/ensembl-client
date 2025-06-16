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
  merge,
  map,
  filter,
  concatMap,
  tap
} from 'rxjs';

import config from 'config';

import { fetch as observableFetch } from 'src/services/observable-api-service';
import {
  createBins,
  createBinKey,
  getBinStartForPosition,
  getBinEndForPosition
} from './binsHelper';

import type { OverviewRegion } from 'src/content/app/regulatory-activity-viewer/types/regionOverview';
import type { GenomeKaryotypeItem } from 'src/shared/state/genome/genomeTypes';

/**
 * This is a service for fetching data about features (genes and regulatory features)
 * within a region, to be displayed in the Regulatory Activity Viewer.
 *
 * The service is implemented as rxjs observable streams for the following reasons:
 *
 * - It should react to the changes in its state over time, and notify its subscribers
 * - It implements its own simple caching mechanism that will avoid sending extra http requests
 *   if the requested region slice is within previously requested slices.
 *   This may be tricky to achieve with redux-toolkit-query, which we otherwise use
 *   for data fetching.
 */

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

export type RegionDetailsData = {
  assemblyId: string;
  region: OverviewRegion['region'];
  bins: Record<
    string, // <-- using string of a format `${start}-${end}` as key
    {
      genes: OverviewRegion['genes'];
      regulatory_features: OverviewRegion['regulatory_features']['data'];
    }
  >;
  regulatory_feature_types: OverviewRegion['regulatory_features']['feature_types'];
};

type RegionDetailsQueryAction = {
  type: 'region-details-query';
  payload: {
    assemblyId: string;
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

export const fetchRegionDetails = (
  params: RegionDetailsQueryAction['payload']
) => {
  regionDetailQueryAction$.next({
    type: 'region-details-query',
    payload: params
  });
};

const filteredRegionDetailQueryAction$ = regionDetailQueryAction$.pipe(
  filter((action) => {
    const { assemblyId, regionName, start, end } = action.payload;
    const currentState = regionDetailsStateSubject.getValue();

    const binKeys = createBins({ start, end }).map(createBinKey);

    // TODO: ideally, should be able to split the request into requesting the lower bins and the higher bins separately
    const haveAllBinsBeenRequested = binKeys.every((key) => {
      const isLoading = currentState.loadingLocations?.some((loc) => {
        return (
          loc.assemblyId === assemblyId &&
          loc.regionName === regionName &&
          loc.bin === key
        );
      });
      const hasLoaded =
        currentState.data?.bins[key] &&
        currentState.data.assemblyId === assemblyId &&
        currentState.data.region.name === regionName;

      return isLoading || hasLoaded;
    });

    // no need to load again if region data has already been fetched and cached
    return !haveAllBinsBeenRequested;
  })
);

export const regionDetailsQuery$ = filteredRegionDetailQueryAction$
  .pipe(
    concatMap((action) => {
      return fetchLocation(action.payload).pipe(
        // tap to send action to update state observable?
        tap((data) => {
          if ('error' in data) {
            // TODO: figure out what to do
            return;
          }

          const { assemblyId } = action.payload;

          const payload = {
            assemblyId,
            region: data.region,
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

/**
 * The purpose of the function below is to distribute features,
 * based on their start and end coordinates,
 * across 'bins' of a certain size, for faster lookup.
 * NOTE: If a feature's start coordinate falls within one bin,
 * and its end coordinate falls within another bin (i.e. if a feature crosses a bin boundary),
 * then it will be duplicated, such that it can be accessed from either one or the other bin.
 */
export const distributeAcrossBins = ({
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
      const key = createBinKey({ start, end });
      obj[key] = { genes: [], regulatory_features: [] };
      return obj;
    },
    {} as RegionDetailsData['bins']
  );

  const addBin = (key: string) => {
    binsMap[key] = { genes: [], regulatory_features: [] };
  };

  for (const gene of genes) {
    const binsForGene = createBins({
      start: gene.start,
      end: gene.end
    });
    const binKeysForGene = binsForGene.map((bin) =>
      createBinKey({ start: bin.start, end: bin.end })
    );
    for (const key of binKeysForGene) {
      if (!binsMap[key]) {
        addBin(key);
      }
      binsMap[key].genes.push(gene);
    }
  }

  for (const regFeature of regulatoryFeatures) {
    const binsForFeature = createBins({
      start: regFeature.start,
      end: regFeature.end
    });
    const binKeysForFeature = binsForFeature.map((bin) =>
      createBinKey({ start: bin.start, end: bin.end })
    );
    for (const key of binKeysForFeature) {
      if (!binsMap[key]) {
        addBin(key);
      }
      binsMap[key].regulatory_features.push(regFeature);
    }
  }

  return binsMap;
};

const regionDetailsResponseAction$ = new Subject<RegionDetailsResponseAction>();

const regionDetailsStateUpdate$ = merge(
  filteredRegionDetailQueryAction$,
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
  if (state.data?.assemblyId && state.data.assemblyId !== payload.assemblyId) {
    // clean up the state to start loading data for a new assembly
    state = { ...initialRegionDetailsState };
  }

  const loadingLocations = payload.binKeys.map((binKey) => ({
    assemblyId: payload.assemblyId,
    regionName: payload.regionName,
    bin: binKey
  }));

  const loadingLocationsInState = state.loadingLocations ?? [];

  return {
    ...state,
    loadingLocations: [...loadingLocationsInState, ...loadingLocations]
  };
};

/**
 * TODO: consider a rare but important edge case:
 * what if response with data for one assembly arrives after request has been sent for another assembly
 * (i.e. while switching between species)
 */
const mergeRegionDetailsState = (
  currentState: RegionDetailsState,
  payload: RegionDetailsResponseAction['payload']
) => {
  // remove the locations in payload from the loading list
  // if location does not exist among the state bins
  // add the bins
  const updatedBins: RegionDetailsData['bins'] = {
    ...currentState.data?.bins
  };
  let loadingLocations = [...(currentState.loadingLocations ?? [])];

  for (const bin of Object.keys(payload.bins)) {
    updatedBins[bin] = payload.bins[bin];
    loadingLocations = loadingLocations.filter((location) => {
      return !(
        location.assemblyId === payload.assemblyId &&
        location.regionName === payload.region.name &&
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
      assemblyId: payload.assemblyId,
      region: payload.region,
      bins: updatedBins,
      regulatory_feature_types: regulatoryFeatureTypes
    }
  };
};

type LoadingLocation = {
  assemblyId: string;
  regionName: string;
  bin: string;
};

export type RegionDetailsState = {
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

const fetchLocation = (params: RegionDetailsQueryAction['payload']) => {
  const { assemblyId, regionName, start, end } = params;
  const locationForUrl = `${regionName}:${start}-${end}`;
  const releaseName = '2025-02'; // TODO: pass genome release with payload
  const endpointUrl = `${config.regulationApiBaseUrl}/annotation/v0.5/release/${releaseName}/assembly/${assemblyId}?location=${locationForUrl}`;

  return observableFetch<OverviewRegion>(endpointUrl);
};
