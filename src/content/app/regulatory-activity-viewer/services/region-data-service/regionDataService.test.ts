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
  type RegionDetailsState
} from './regionDataService';
import { createBins, createBinKey } from './binsHelper';

import { getGenomicLocationFromString } from 'src/shared/helpers/genomicLocationHelpers';

import {
  createGenePayload,
  createOverviewRegionPayload
} from './fixtures/mockRegionDataResponse';

const mockRegulationApiRoot = 'http://regulation-api';

jest.mock('config', () => ({
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
          start
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

describe('fetching data for a detailed slice', () => {
  test('request location smaller than bin size', async () => {
    const assemblyName = 'grch38';
    const regionName = '1';
    const start = 10_000;
    const end = 20_000;

    fetchRegionDetails({
      assemblyName: 'grch38',
      regionName: '1',
      start: 10000,
      end: 20000
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
        assemblyName,
        regionName,
        bin: binKey
      });

      const stateWithLoadedData = stateUpdates[1];
      expect(stateWithLoadedData.loadingLocations).toBe(null);
      expect(stateWithLoadedData.data?.assemblyName).toBe(assemblyName);
      expect(stateWithLoadedData.data?.region.name).toBe(regionName);
      expect(stateWithLoadedData.data?.bins[binKey]).not.toBeFalsy();
    });
  });

  test.todo('request location larger than bin size');

  test.todo('request location for which data is available locally');

  test.todo('response contains a feature that spans more than one bin');

  test.todo(
    'order of queried regions/genomes should not be disrupted by slow responses'
  );

  test.todo('switch assembly');

  test.todo('switch region');
});
