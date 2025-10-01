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

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { waitFor } from '@testing-library/react';

import {
  fetchRegionDetails,
  regionDetailsState$,
  distributeAcrossBins,
  type RegionDetailsState
} from './regionDataService';
import { createBins, createBinKey, BIN_SIZE } from './binsHelper';

import { getGenomicLocationFromString } from 'src/shared/helpers/genomicLocationHelpers';

import {
  createGenePayload,
  createRegulatoryFeaturePayload,
  createOverviewRegionPayload
} from './fixtures/mockRegionDataResponse';

const mockRegulationApiRoot = 'http://regulation-api';

vi.mock('config', () => ({
  metadataApiBaseUrl: 'http://metadata-api',
  regulationApiBaseUrl: 'http://regulation-api'
}));

const server = setupServer(
  http.get(
    `${mockRegulationApiRoot}/annotation/:version/release/:release_name/assembly/:assembly_name`,
    ({ request }) => {
      const url = new URL(request.url);
      const locationString = url.searchParams.get('location') as string;
      const genomicLocation = getGenomicLocationFromString(locationString);
      const genomicDistance = genomicLocation.end - genomicLocation.start + 1;
      const geneCount = 10;
      const geneStarts = [...Array(geneCount)].map((_, index) => {
        return (
          genomicLocation.start +
          index * Math.floor(genomicDistance / geneCount)
        );
      });

      const genes = geneStarts.map((start) =>
        createGenePayload({
          start,
          end: start + 5_000
        })
      );
      const regionOverviewPayload = createOverviewRegionPayload({
        region: {
          name: genomicLocation.regionName,
          coordinate_system: 'chromosome',
          length: 1_000_000
        },
        genes
      });

      return HttpResponse.json(regionOverviewPayload);
    }
  )
);

beforeAll(() =>
  server.listen({
    onUnhandledRequest(req) {
      const errorMessage = `Found an unhandled ${req.method} request to ${req.url}`;
      throw new Error(errorMessage);
    }
  })
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

/**
 * NOTE: as regionDataService is currently implemented,
 * its state persists between tests, which means tests aren't truly isolated from one another.
 */

describe('fetching data for a detailed slice', () => {
  test('request location smaller than bin size', async () => {
    const assemblyId = 'grch38';
    const regionName = '1';
    const start = 10_000;
    const end = 20_000;

    fetchRegionDetails({
      assemblyId,
      regionName,
      start,
      end
    });

    const stateUpdates: RegionDetailsState[] = [];

    // Observing changes of the state
    regionDetailsState$.subscribe((state) => {
      stateUpdates.push(state);
    });

    await waitFor(() => {
      const loadingState = stateUpdates[0];
      const bins = createBins({ start, end });
      const binKey = createBinKey(bins[0]);
      expect(loadingState.loadingLocations?.[0]).toEqual({
        assemblyId,
        regionName,
        bin: binKey
      });

      const stateWithLoadedData = stateUpdates[1];
      expect(stateWithLoadedData.loadingLocations).toBe(null);
      expect(stateWithLoadedData.data?.assemblyId).toBe(assemblyId);
      expect(stateWithLoadedData.data?.region.name).toBe(regionName);
      expect(stateWithLoadedData.data?.bins[binKey]).not.toBeFalsy();
    });
  });

  test('sequential requests for same assembly and region', async () => {
    const requestParams1 = {
      assemblyId: 'grch38',
      regionName: '2',
      start: 10_000,
      end: 20_000
    };
    const requestParams2 = {
      assemblyId: 'grch38',
      regionName: '2',
      start: BIN_SIZE + 100_000,
      end: BIN_SIZE + 120_000
    };

    fetchRegionDetails(requestParams1);
    fetchRegionDetails(requestParams2);

    const stateUpdates: RegionDetailsState[] = [];

    // Observing state changes
    regionDetailsState$.subscribe((state) => {
      stateUpdates.push(state);
    });

    await waitFor(() => {
      const finalState = stateUpdates.at(-1) as RegionDetailsState;

      expect(finalState.loadingLocations).toBe(null);
      expect(finalState.data?.assemblyId).toBe(requestParams1.assemblyId);
      expect(finalState.data?.region.name).toBe(requestParams1.regionName);

      const genes = [...Object.values(finalState.data!.bins)]
        .map((bin) => bin.genes)
        .flat();

      // some genes should be from the first request; and others from the second
      expect(genes.some((gene) => gene.start < requestParams1.end)).toBe(true); // genes from the first request
      expect(genes.some((gene) => gene.start > requestParams2.start)).toBe(
        true
      ); // genes from the second request
    });
  });

  test('switch assembly', async () => {
    const requestParams1 = {
      assemblyId: 'grch38',
      regionName: '1',
      start: 10_000,
      end: 20_000
    };
    const requestParams2 = {
      assemblyId: 'grch37',
      regionName: '1',
      start: 100_000,
      end: 120_000
    };

    fetchRegionDetails(requestParams1);
    fetchRegionDetails(requestParams2);

    const stateUpdates: RegionDetailsState[] = [];

    // Observing state changes
    regionDetailsState$.subscribe((state) => {
      stateUpdates.push(state);
    });

    await waitFor(() => {
      const finalState = stateUpdates.at(-1) as RegionDetailsState;

      expect(finalState.loadingLocations).toBe(null);
      expect(finalState.data?.assemblyId).toBe(requestParams2.assemblyId);
      expect(finalState.data?.region.name).toBe(requestParams2.regionName);

      const genes = [...Object.values(finalState.data!.bins)]
        .map((bin) => bin.genes)
        .flat();

      // make sure that all the genes are from the slice requested in the second request
      expect(genes.every((gene) => gene.start > requestParams1.end)).toBe(true);
    });
  });

  // Same as previous test; but checks that the service correctly switches from one region to another
  test('switch region', async () => {
    const requestParams1 = {
      assemblyId: 'grch38',
      regionName: '1',
      start: 10_000,
      end: 20_000
    };
    const requestParams2 = {
      assemblyId: 'grch38',
      regionName: '2',
      start: 100_000,
      end: 120_000
    };

    fetchRegionDetails(requestParams1);
    fetchRegionDetails(requestParams2);

    const stateUpdates: RegionDetailsState[] = [];

    // Observing state changes
    regionDetailsState$.subscribe((state) => {
      stateUpdates.push(state);
    });

    await waitFor(() => {
      const finalState = stateUpdates.at(-1) as RegionDetailsState;

      expect(finalState.loadingLocations).toBe(null);
      expect(finalState.data?.assemblyId).toBe(requestParams2.assemblyId);
      expect(finalState.data?.region.name).toBe(requestParams2.regionName);

      const genes = [...Object.values(finalState.data!.bins)]
        .map((bin) => bin.genes)
        .flat();

      // make sure that all the genes are from the slice requested in the second request
      expect(genes.every((gene) => gene.start > requestParams1.end)).toBe(true);
    });
  });
});

/**
 * This is a helper function used by regionDataService.
 * Its purpose is to distribute features, based on their start and end coordinates,
 * across 'bins' of a certain size, for faster lookup.
 * NOTE: If a feature starts within a slice covered by one bin,
 * and ends within a slice covered by another bin,
 * i.e. if it crosses a bin boundary,
 * then it will be duplicated, such that it can be accessed from either one or the other bin.
 */
describe('distributeAcrossBins', () => {
  it('distributes features across bins', () => {
    const assemblyId = 'grch38';
    const regionName = '1';
    const start = 500_000;
    const end = 1_500_000;

    // lies completely within one bin
    const gene1 = createGenePayload({
      start,
      end: start + 50_000
    });
    const regFeature1 = createRegulatoryFeaturePayload({
      start,
      end: start + 1_000
    });

    // crosses bins boundary
    const gene2 = createGenePayload({
      start: BIN_SIZE - 20_000,
      end: BIN_SIZE + 20_000
    });
    const regFeature2 = createRegulatoryFeaturePayload({
      start: BIN_SIZE - 1_000,
      end: BIN_SIZE + 1_000
    });

    // lies completely within second bin
    const gene3 = createGenePayload({
      start: end - 20_000,
      end: end
    });
    const regFeature3 = createRegulatoryFeaturePayload({
      start: end - 1_000,
      end: end
    });

    const regionOverviewPayload = createOverviewRegionPayload({
      genes: [gene1, gene2, gene3],
      regulatory_features: {
        feature_types: {},
        data: [regFeature1, regFeature2, regFeature3]
      }
    });

    const requestParams = {
      assemblyId,
      regionName,
      start,
      end
    };
    const bins = distributeAcrossBins({
      requestParams,
      response: regionOverviewPayload
    });

    const expectedBinKeys = createBins({ start, end }).map(createBinKey);

    expect(Object.keys(bins)).toEqual(expectedBinKeys);

    const firstBin = bins[expectedBinKeys[0]];
    expect(firstBin.genes.map((gene) => gene.stable_id)).toEqual([
      gene1.stable_id,
      gene2.stable_id
    ]);
    expect(firstBin.regulatory_features.map((feature) => feature.id)).toEqual([
      regFeature1.id,
      regFeature2.id
    ]);

    const secondBin = bins[expectedBinKeys[1]];
    expect(secondBin.genes.map((gene) => gene.stable_id)).toEqual([
      gene2.stable_id,
      gene3.stable_id
    ]);
    expect(secondBin.regulatory_features.map((feature) => feature.id)).toEqual([
      regFeature2.id,
      regFeature3.id
    ]);
  });
});
