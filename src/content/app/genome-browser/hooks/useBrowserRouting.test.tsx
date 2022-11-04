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

import React, { createContext, useContext } from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router';
import set from 'lodash/fp/set';

import createRootReducer from 'src/root/rootReducer';

import restApiSlice from 'src/shared/state/api-slices/restSlice';

import useBrowserRouting from './useBrowserRouting';

import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import { GenomeBrowserIdsProvider } from '../contexts/GenomeBrowserIdsContext';

// NOTE: scary stuff, but if you prefix function name with the word "mock",
// jest will allow passing them to the factory function of jest.mock
const mockChangeFocusObject = jest.fn();
const mockChangeBrowserLocation = jest.fn();

const mockGenomeSearchApiBaseUrl = 'http://genome-search-api';
const mockGenomeBrowserObj = {};

jest.mock('config', () => ({
  genomeSearchBaseUrl: 'http://genome-search-api'
}));

jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowser',
  () => () => ({
    genomeBrowser: mockGenomeBrowserObj,
    changeFocusObject: mockChangeFocusObject,
    changeBrowserLocation: mockChangeBrowserLocation
  })
);

jest.mock(
  'src/content/app/genome-browser/state/focus-object/focusObjectSlice',
  () => ({
    fetchFocusObject: jest.fn(() => ({ type: 'fetch-focus-object' }))
  })
);

const humanGenomeInfo = {
  assembly_name: 'GRCh38.p13',
  common_name: 'Human',
  genome_id: 'homo_sapiens_GCA_000001405_28',
  scientific_name: 'Homo sapiens',
  genome_tag: 'grch38'
};

const wheatGenomeInfo = {
  assembly_name: 'IWGSC',
  common_name: null,
  genome_id: 'triticum_aestivum_GCA_900519105_1',
  scientific_name: 'Triticum aestivum',
  genome_tag: 'iwgsc'
};

const committedHuman = {
  ...createSelectedSpecies(),
  genome_id: humanGenomeInfo.genome_id,
  genome_tag: humanGenomeInfo.genome_tag
};

const committedWheat = {
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
    committedItems: [committedHuman, committedWheat]
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
      getDefaultMiddleware().concat([restApiSlice.middleware]),
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
  rest.get(`${mockGenomeSearchApiBaseUrl}/genome/info`, (req, res, ctx) => {
    const genomeId = req.url.searchParams.get('genome_id');

    if (
      genomeId === humanGenomeInfo.genome_id ||
      genomeId === humanGenomeInfo.genome_tag
    ) {
      return res(
        ctx.json({
          genome_info: [humanGenomeInfo]
        })
      );
    } else if (
      genomeId === wheatGenomeInfo.genome_id ||
      genomeId === wheatGenomeInfo.genome_tag
    ) {
      return res(
        ctx.json({
          genome_info: [wheatGenomeInfo]
        })
      );
    }
  })
);

beforeAll(() =>
  server.listen({
    onUnhandledRequest(req) {
      const errorMessage = `Found an unhandled ${req.method} request to ${req.url.href}`;
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
        'speciesSelector.committedItems',
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
          focusId: 'ENSG00000139618',
          chrLocation: ['13', 100, 200]
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
