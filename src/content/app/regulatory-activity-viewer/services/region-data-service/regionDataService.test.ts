import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

import {
  fetchRegionDetails,
  dispatchRegionDetailsStateQuery,
  regionDetailsState$,
  regionDetailsStateQuery$,
  regionDetailsSelection$
} from './regionDataService';

import { getGenomicLocationFromString } from 'src/shared/helpers/genomicLocationHelpers';

import { createGenePayload, createOverviewRegionPayload } from './fixtures/mockRegionDataResponse';

const mockMetadataApiRoot = 'http://metadata-api';
const mockRegulationApiRoot = 'http://regulation-api';

jest.mock('config', () => ({
  metadataApiBaseUrl: 'http://metadata-api',
  regulationApiBaseUrl: 'http://regulation-api',
}));

const server = setupServer(
  http.get(
    `${mockRegulationApiRoot}/region-of-interest/:version/assembly/:assembly_name`,
    ({ request, params }) => {
      const url = new URL(request.url);
      const locationString = url.searchParams.get('location') as string;
      const genomicLocation = getGenomicLocationFromString(locationString);
      console.log('params', params, 'genomicLocation', genomicLocation);

      const genes = [
        createGenePayload({
          start: genomicLocation.start
        })
      ];
      const regionOverviewPayload = createOverviewRegionPayload({
        region_name: genomicLocation.regionName,
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


  test.todo('simple case: just fetch the data');

  test.todo('request location smaller than bin size');

  test.todo('request location larger than bin size');

  test.todo('what if full region data is already available?');

  test.todo('order of queried regions/genomes should not be disrupted by slow responses');

  test.todo('switch assembly');

  test.todo('switch region');



  test('foo', async () => {
    const { promise, resolve } = Promise.withResolvers();

    // Observing changes of the state
    // regionDetailsState$.subscribe((state) => {
    //   console.log('state', state);
    //   // resolve(state);
    // });

    fetchRegionDetails({
      assemblyName: 'grch38',
      regionName: '1',
      start: 10000,
      end: 20000
    });
    // regionDetailsStateQuery$.subscribe(q => console.log('q here', q));

    dispatchRegionDetailsStateQuery({
      assemblyName: 'grch38',
      regionName: '1',
      start: 10000,
      end: 20000
    });


    regionDetailsSelection$.subscribe(data => {
      console.log('data', data);
      resolve(null);
    })

    await promise;
  });

});
