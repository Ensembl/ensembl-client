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

import { createContext, useContext } from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { http, graphql, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router';
import set from 'lodash/fp/set';

import createRootReducer from 'src/root/rootReducer';

import restApiSlice from 'src/shared/state/api-slices/restSlice';
import graphqlApiSlice from 'src/shared/state/api-slices/graphqlApiSlice';

import useBrowserRouting from './useBrowserRouting';

import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import { GenomeBrowserIdsProvider } from '../contexts/genome-browser-ids-context/GenomeBrowserIdsContext';

import type { BriefGenomeSummary } from 'src/shared/state/genome/genomeTypes';

// NOTE: scary stuff, but if you prefix function name with the word "mock",
// jest will allow passing them to the factory function of jest.mock
const mockChangeFocusObject = jest.fn();
const mockChangeBrowserLocation = jest.fn();

const mockMetadataApiBaseUrl = 'http://metadata-api';
const mockGenomeBrowserObj = {};

jest.mock('config', () => ({
  metadataApiBaseUrl: 'http://metadata-api',
  coreApiUrl: 'http://graphql-api'
}));

jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowser',
  () => () => ({
    genomeBrowser: mockGenomeBrowserObj,
    changeFocusObject: mockChangeFocusObject,
    changeBrowserLocation: mockChangeBrowserLocation
  })
);

type GenomeExplainerResponse = Pick<
  BriefGenomeSummary,
  'genome_id' | 'genome_tag' | 'common_name' | 'scientific_name'
>;

const humanGenomeInfo: GenomeExplainerResponse = {
  genome_id: 'homo_sapiens_GCA_000001405_28',
  genome_tag: 'grch38',
  common_name: 'Human',
  scientific_name: 'Homo sapiens'
};

const wheatGenomeInfo: GenomeExplainerResponse = {
  genome_id: 'triticum_aestivum_GCA_900519105_1',
  genome_tag: 'iwgsc',
  common_name: null,
  scientific_name: 'Triticum aestivum'
};

const committedHuman: GenomeExplainerResponse = {
  ...createSelectedSpecies(),
  genome_id: humanGenomeInfo.genome_id,
  genome_tag: humanGenomeInfo.genome_tag
};

const committedWheat: GenomeExplainerResponse = {
  ...createSelectedSpecies(),
  genome_id: wheatGenomeInfo.genome_id,
  genome_tag: wheatGenomeInfo.genome_tag
};

const mockState = {
  browser: {
    browserGeneral: {
      activeGenomeId: humanGenomeInfo.genome_id,
      activeFocusObjectIds: {
        [humanGenomeInfo.genome_id]: `${humanGenomeInfo.genome_id}:gene:ENSG00000139618`
      },
      chrLocations: {
        [humanGenomeInfo.genome_id]: ['13', 100, 200]
      }
    }
  },
  speciesSelector: {
    general: {
      committedItems: [committedHuman, committedWheat]
    }
  }
};

let routingHandle: ReturnType<typeof useBrowserRouting> | null = null;
const emptyMockRouterContext = {
  url: '',
  pathname: '',
  search: ''
};
let mockRouterContext: typeof emptyMockRouterContext;

const MockRouterContext = createContext(emptyMockRouterContext);

const TestComponent = () => {
  const { pathname, search } = useLocation();
  const mockRouterContext = useContext(MockRouterContext);

  routingHandle = useBrowserRouting();

  mockRouterContext.url = `${pathname}${search}`;
  mockRouterContext.pathname = pathname;
  mockRouterContext.search = search;

  return <div>content doesn't matter</div>;
};

const renderComponent = ({
  state = mockState,
  path
}: {
  state?: typeof mockState;
  path: string;
}) => {
  mockRouterContext = { ...emptyMockRouterContext };

  const store = configureStore({
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([
        restApiSlice.middleware,
        graphqlApiSlice.middleware
      ]),
    preloadedState: state as any
  });

  const renderResult = render(
    <Provider store={store}>
      <MockRouterContext.Provider value={mockRouterContext}>
        <MemoryRouter initialEntries={[path]}>
          <GenomeBrowserIdsProvider>
            <Routes>
              <Route path="/genome-browser" element={<TestComponent />} />
              <Route
                path="/genome-browser/:genomeId"
                element={<TestComponent />}
              />
            </Routes>
          </GenomeBrowserIdsProvider>
        </MemoryRouter>
      </MockRouterContext.Provider>
    </Provider>
  );

  return {
    ...renderResult,
    store
  };
};

const server = setupServer(
  http.get(`${mockMetadataApiBaseUrl}/genome/:slug/explain`, ({ params }) => {
    const { slug } = params;

    if (
      slug === humanGenomeInfo.genome_id ||
      slug === humanGenomeInfo.genome_tag
    ) {
      return HttpResponse.json(humanGenomeInfo);
    } else if (
      slug === wheatGenomeInfo.genome_id ||
      slug === wheatGenomeInfo.genome_tag
    ) {
      return HttpResponse.json(wheatGenomeInfo);
    }
  }),
  http.get(`${mockMetadataApiBaseUrl}/validate_location`, ({ request }) => {
    const url = new URL(request.url);
    const location = url.searchParams.get('location');

    // send back the same location as was in the url; this should be enough to pass the validation
    return HttpResponse.json({ location });
  }),
  graphql.query('TrackPanelGene', () => {
    return HttpResponse.json({
      data: {
        gene: {
          stable_id: 'doesnt-matter'
        }
      }
    });
  })
);

beforeAll(() =>
  server.listen({
    onUnhandledRequest(req) {
      const errorMessage = `Found an unhandled ${req.method} request to ${req.url}`;
      throw new Error(errorMessage);
    }
  })
);
afterAll(() => server.close());

describe('useBrowserRouting', () => {
  afterEach(() => {
    jest.clearAllMocks();
    routingHandle = null;
  });

  describe('navigation to /genome-browser (no species, focus object or location in the url)', () => {
    it('redirects to url for active genome', async () => {
      const updatedState = set(
        'browser.browserGeneral.activeGenomeId',
        wheatGenomeInfo.genome_id,
        mockState
      );
      renderComponent({ state: updatedState, path: '/genome-browser' });

      // this is useless, because this route will be handled by the interstitial;
      // yet this is how the code currently behaves
      await waitFor(() => {
        expect(mockRouterContext.url).toBe(
          `/genome-browser/${wheatGenomeInfo.genome_tag}`
        );
      });
    });

    it('redirects to url for active genome using focus id and location from redux', () => {
      // human is set as active genome in mock redux state
      renderComponent({ path: '/genome-browser' });

      // notice how the identifier "human:gene:ENSG00000139618" that was used in the mock redux state
      // is reformatted to gene:ENSG00000139618 in the url;
      // this can be tested by examining TestComponent after a switch to react-router v6
      expect(mockRouterContext.url).toBe(
        `/genome-browser/${humanGenomeInfo.genome_tag}?focus=gene:ENSG00000139618&location=13:100-200`
      );
    });

    it('redirects to url for the first of the selected species in absence of active genome id', () => {
      let updatedState = set(
        'browser.browserGeneral.activeGenomeId',
        null,
        mockState
      );
      updatedState = set(
        'speciesSelector.general.committedItems',
        [committedWheat, committedHuman],
        updatedState
      );

      renderComponent({ state: updatedState, path: '/genome-browser' });

      // this is useless behaviour; yet this is how the code currently behaves
      expect(mockRouterContext.url).toBe(
        `/genome-browser/${committedWheat.genome_tag}`
      );
    });
  });

  describe('navigation to /genome-browser/:genome_id', () => {
    it('sets the data from the url in redux', async () => {
      const { store } = renderComponent({
        path: `/genome-browser/${wheatGenomeInfo.genome_tag}`
      });

      await waitFor(() => {
        const state = store.getState();
        expect(state.browser.browserGeneral.activeGenomeId).toBe(
          wheatGenomeInfo.genome_id
        );
      });
    });

    it('redirects to url containing focus id if available in redux', async () => {
      renderComponent({
        path: `/genome-browser/${humanGenomeInfo.genome_tag}`
      });

      await waitFor(() => {
        expect(mockRouterContext.url).toBe(
          `/genome-browser/${humanGenomeInfo.genome_tag}?focus=gene:ENSG00000139618`
        );
      });
    });
  });

  describe('navigation to /genome-browser/:genome_id with focus object', () => {
    it('sets the data from the url in redux', async () => {
      const geneStableId = 'TraesCS1D02G435500';
      const url = `/genome-browser/${wheatGenomeInfo.genome_tag}?focus=gene:${geneStableId}`;
      const { store } = renderComponent({
        path: url
      });

      await waitFor(() => {
        const state = store.getState();
        expect(state.browser.browserGeneral.activeGenomeId).toBe(
          wheatGenomeInfo.genome_id
        );
        expect(
          state.browser.browserGeneral.activeFocusObjectIds[
            wheatGenomeInfo.genome_id
          ]
        ).toBe(`${wheatGenomeInfo.genome_id}:gene:${geneStableId}`);
        // no navigation actions expected
        expect(mockRouterContext.url).toBe(url);
      });
    });

    it('tells genome browser to switch to the focus object from the url', async () => {
      const geneStableId = 'ENSG00000139618';
      const url = `/genome-browser/${humanGenomeInfo.genome_tag}?focus=gene:ENSG00000139618`;
      renderComponent({
        path: url
      });

      await waitFor(() => {
        expect(mockChangeFocusObject).toHaveBeenCalledWith(
          `${humanGenomeInfo.genome_id}:gene:${geneStableId}`
        );
        expect(mockChangeBrowserLocation).not.toHaveBeenCalled();
      });
    });
  });

  describe('navigation to /genome-browser/:genome_id with focus object and location', () => {
    it('sets the data from the url in redux', async () => {
      const geneStableId = 'TraesCS1D02G435500';
      const url = `/genome-browser/${wheatGenomeInfo.genome_tag}?focus=gene:${geneStableId}&location=3D:100-200`;
      const { store } = renderComponent({
        path: url
      });

      await waitFor(() => {
        const state = store.getState();
        expect(state.browser.browserGeneral.activeGenomeId).toBe(
          wheatGenomeInfo.genome_id
        );
        expect(
          state.browser.browserGeneral.activeFocusObjectIds[
            wheatGenomeInfo.genome_id
          ]
        ).toBe(`${wheatGenomeInfo.genome_id}:gene:${geneStableId}`);
        expect(
          state.browser.browserGeneral.chrLocations[wheatGenomeInfo.genome_id]
        ).toEqual(['3D', 100, 200]);

        // no navigation actions expected
        expect(mockRouterContext.url).toBe(url);
      });
    });

    it('tells genome browser to set the focus object and the location from the url', async () => {
      renderComponent({
        path: `/genome-browser/${humanGenomeInfo.genome_tag}?focus=gene:ENSG00000139618&location=13:100-200`
      });

      await waitFor(() => {
        expect(mockChangeBrowserLocation).toHaveBeenCalledWith({
          genomeId: humanGenomeInfo.genome_id,
          chrLocation: ['13', 100, 200],
          focus: {
            id: 'ENSG00000139618',
            type: 'gene'
          }
        });
      });
    });
  });

  describe('useBrowserRouting‘s return value', () => {
    describe('changeGenomeId', () => {
      it('redirects to correct url when focus id and location for new genome are unavailable', () => {
        renderComponent({
          path: `/genome-browser/${humanGenomeInfo.genome_tag}?focus=gene:ENSG00000139618&location=13:100-200`
        });

        act(() => {
          routingHandle?.changeGenomeId(wheatGenomeInfo.genome_id);
        });

        expect(mockRouterContext.url).toBe(
          `/genome-browser/${wheatGenomeInfo.genome_tag}`
        );
      });

      it('redirects to correct url when only focus id for new genome is available', () => {
        const updatedState = set(
          `browser.browserGeneral.activeFocusObjectIds.${wheatGenomeInfo.genome_id}`,
          `${wheatGenomeInfo.genome_id}:gene:TraesCS3D02G273600`,
          mockState
        );
        renderComponent({
          state: updatedState,
          path: `/genome-browser/${humanGenomeInfo.genome_tag}?focus=gene:ENSG00000139618&location=13:100-200`
        });

        act(() => {
          routingHandle?.changeGenomeId(wheatGenomeInfo.genome_id);
        });

        expect(mockRouterContext.url).toBe(
          `/genome-browser/${wheatGenomeInfo.genome_tag}?focus=gene:TraesCS3D02G273600`
        );
      });

      it('redirects to correct url when both focus id and location for new genome are available', () => {
        let updatedState = set(
          `browser.browserGeneral.activeFocusObjectIds.${wheatGenomeInfo.genome_id}`,
          `${wheatGenomeInfo.genome_id}:gene:TraesCS3D02G273600`,
          mockState
        );
        updatedState = set(
          `browser.browserGeneral.chrLocations.${wheatGenomeInfo.genome_id}`,
          ['3D', 1000, 1100],
          updatedState
        );
        renderComponent({
          state: updatedState,
          path: `/genome-browser/${humanGenomeInfo.genome_tag}?focus=gene:ENSG00000139618&location=13:100-200`
        });

        act(() => {
          routingHandle?.changeGenomeId(wheatGenomeInfo.genome_id);
        });

        expect(mockRouterContext.url).toBe(
          `/genome-browser/${wheatGenomeInfo.genome_tag}?focus=gene:TraesCS3D02G273600&location=3D:1000-1100`
        );
      });
    });
  });
});
