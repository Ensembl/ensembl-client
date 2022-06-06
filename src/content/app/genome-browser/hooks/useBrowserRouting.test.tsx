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
import { render, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router';
import configureMockStore from 'redux-mock-store';
import set from 'lodash/fp/set';

import * as genomeActions from 'src/shared/state/genome/genomeSlice';
import * as browserGeneralActions from '../state/browser-general/browserGeneralSlice';

import useBrowserRouting from './useBrowserRouting';

import { createSelectedSpecies } from 'tests/fixtures/selected-species';
import { createGenomeCategories } from 'tests/fixtures/genomes';

// NOTE: scary stuff, but if you prefix function name with the word "mock",
// jest will allow passing them to the factory function of jest.mock
const mockChangeFocusObject = jest.fn();
const mockChangeBrowserLocation = jest.fn();

jest.mock(
  'src/content/app/genome-browser/state/browser-general/browserGeneralSlice.ts',
  () => ({
    setActiveGenomeId: jest.fn(() => ({ type: 'setActiveGenomeId' })),
    setDataFromUrlAndSave: jest.fn(() => ({ type: 'setDataFromUrlAndSave' }))
  })
);

jest.mock('src/shared/state/genome/genomeSlice', () => ({
  fetchGenomeData: jest.fn(() => ({ type: 'fetchGenomeData' }))
}));

jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowser',
  () => () => ({
    genomeBrowser: {},
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

const committedHuman = {
  ...createSelectedSpecies(),
  genome_id: 'human'
};

const committedWheat = {
  ...createSelectedSpecies(),
  genome_id: 'wheat'
};

const mockState = {
  browser: {
    browserGeneral: {
      activeGenomeId: 'human',
      activeFocusObjectIds: {
        human: 'human:gene:ENSG00000139618'
      },
      chrLocations: {
        human: ['13', 100, 200]
      }
    }
  },
  genome: {
    genomeTrackCategories: {
      genomeTrackCategoriesData: {
        fake_genome_id_1: createGenomeCategories()
      }
    }
  },
  speciesSelector: {
    committedItems: [committedHuman, committedWheat]
  }
};

const mockStore = configureMockStore([thunk]);

let routingHandle: ReturnType<typeof useBrowserRouting> | null = null;
const emptyTestContext = {
  url: '',
  pathname: '',
  search: ''
};
let testContext: typeof emptyTestContext;

const TestContext = createContext(emptyTestContext);

const TestComponent = () => {
  const { pathname, search } = useLocation();
  const context = useContext(TestContext);
  routingHandle = useBrowserRouting();

  context.url = `${pathname}${search}`;
  context.pathname = pathname;
  context.search = search;

  return <div>content doesn't matter</div>;
};

const renderComponent = ({
  state = mockState,
  path
}: {
  state?: typeof mockState;
  path: string;
}) => {
  testContext = { ...emptyTestContext };

  return render(
    <Provider store={mockStore(state)}>
      <TestContext.Provider value={testContext}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/genome-browser" element={<TestComponent />} />
            <Route
              path="/genome-browser/:genomeId"
              element={<TestComponent />}
            />
          </Routes>
        </MemoryRouter>
      </TestContext.Provider>
    </Provider>
  );
};

describe.skip('useBrowserRouting', () => {
  afterEach(() => {
    jest.clearAllMocks();
    routingHandle = null;
  });

  describe('navigation to /genome-browser (no species, focus object or location in the url)', () => {
    it('redirects to url for active genome', () => {
      const updatedState = set(
        'browser.browserGeneral.activeGenomeId',
        'wheat',
        mockState
      );
      renderComponent({ state: updatedState, path: '/genome-browser' });

      // this is useless, because this route will be handled by the interstitial;
      // yet this is how the code currently behaves
      expect(testContext.url).toBe('/genome-browser/wheat');
    });

    it('redirects to url for active genome using focus id and location from redux', () => {
      // human is set as active genome in mock redux state
      renderComponent({ path: '/genome-browser' });

      // notice how the identifier "human:gene:ENSG00000139618" that was used in the mock store
      // is reformatted to gene:ENSG00000139618 in the url;
      // this can be tested by examining TestComponent after a switch to react-router v6
      expect(testContext.url).toBe(
        '/genome-browser/human?focus=gene:ENSG00000139618&location=13:100-200'
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
      expect(testContext.url).toBe('/genome-browser/wheat');
    });
  });

  describe('navigation to /genome-browser/:genome_id', () => {
    it('sets the data from the url in redux', () => {
      renderComponent({ path: '/genome-browser/human' });

      expect(browserGeneralActions.setDataFromUrlAndSave).toHaveBeenCalledWith({
        activeGenomeId: 'human',
        activeFocusObjectId: null,
        chrLocation: null
      });
    });

    it('fetches the genome using the genome id from the url', async () => {
      renderComponent({ path: '/genome-browser/human' });

      expect(genomeActions.fetchGenomeData).toHaveBeenCalledWith('human');
    });

    it('redirects to url containing focus id if available in redux', () => {
      renderComponent({ path: '/genome-browser/human' });

      expect(testContext.url).toBe(
        '/genome-browser/human?focus=gene:ENSG00000139618'
      );
    });
  });

  describe('navigation to /genome-browser/:genome_id with focus object', () => {
    it('sets the data from the url in redux', () => {
      renderComponent({
        path: '/genome-browser/human?focus=gene:ENSG00000139618'
      });

      expect(browserGeneralActions.setDataFromUrlAndSave).toHaveBeenCalledWith({
        activeGenomeId: 'human',
        activeFocusObjectId: 'human:gene:ENSG00000139618', // <-- notice how genome id is included in focus object id
        chrLocation: null
      });

      // no navigation actions expected
      expect(testContext.url).toBe(
        '/genome-browser/human?focus=gene:ENSG00000139618'
      );
    });

    it('tells genome browser to switch to the focus object from the url', () => {
      renderComponent({
        path: '/genome-browser/human?focus=gene:ENSG00000139618'
      });

      expect(mockChangeFocusObject).toHaveBeenCalledWith(
        'human:gene:ENSG00000139618'
      );
      expect(mockChangeBrowserLocation).not.toHaveBeenCalled();
    });
  });

  describe('navigation to /genome-browser/:genome_id with focus object and location', () => {
    it('sets the data from the url in redux', () => {
      renderComponent({
        path: '/genome-browser/human?focus=gene:ENSG00000139618&location=13:100-200'
      });

      expect(browserGeneralActions.setDataFromUrlAndSave).toHaveBeenCalledWith({
        activeGenomeId: 'human',
        activeFocusObjectId: 'human:gene:ENSG00000139618', // <-- notice how genome id is included in focus object id
        chrLocation: ['13', 100, 200]
      });

      // no navigation actions expected
      expect(testContext.url).toBe(
        '/genome-browser/human?focus=gene:ENSG00000139618&location=13:100-200'
      );
    });

    it('tells genome browser to set the focus object and the location from the url', () => {
      renderComponent({
        path: '/genome-browser/human?focus=gene:ENSG00000139618&location=13:100-200'
      });

      expect(mockChangeBrowserLocation).toHaveBeenCalledWith({
        genomeId: 'human',
        focusId: 'ENSG00000139618',
        chrLocation: ['13', 100, 200]
      });
    });
  });

  describe('useBrowserRouting‘s return value', () => {
    describe('changeGenomeId', () => {
      it('redirects to correct url when focus id and location for new genome are unavailable', () => {
        renderComponent({
          path: '/genome-browser/human?focus=gene:ENSG00000139618&location=13:100-200'
        });
        jest.clearAllMocks();
        jest.spyOn(browserGeneralActions, 'setActiveGenomeId');

        act(() => {
          routingHandle?.changeGenomeId('wheat');
        });

        expect(testContext.url).toBe('/genome-browser/wheat');
        expect(browserGeneralActions.setActiveGenomeId).toHaveBeenCalledWith(
          'wheat'
        );
      });

      it('redirects to correct url when only focus id for new genome is available', () => {
        const updatedState = set(
          'browser.browserGeneral.activeFocusObjectIds.wheat',
          'wheat:gene:TraesCS3D02G273600',
          mockState
        );
        renderComponent({
          state: updatedState,
          path: '/genome-browser/human?focus=gene:ENSG00000139618&location=13:100-200'
        });
        jest.clearAllMocks();
        jest.spyOn(browserGeneralActions, 'setActiveGenomeId');

        act(() => {
          routingHandle?.changeGenomeId('wheat');
        });

        expect(testContext.url).toBe(
          '/genome-browser/wheat?focus=gene:TraesCS3D02G273600'
        );
        expect(browserGeneralActions.setActiveGenomeId).toHaveBeenCalledWith(
          'wheat'
        );
      });

      it('redirects to correct url when both focus id and location for new genome are available', () => {
        let updatedState = set(
          'browser.browserGeneral.activeFocusObjectIds.wheat',
          'wheat:gene:TraesCS3D02G273600',
          mockState
        );
        updatedState = set(
          'browser.browserGeneral.chrLocations.wheat',
          ['3D', 1000, 1100],
          updatedState
        );
        renderComponent({
          state: updatedState,
          path: '/genome-browser/human?focus=gene:ENSG00000139618&location=13:100-200'
        });
        jest.clearAllMocks();
        jest.spyOn(browserGeneralActions, 'setActiveGenomeId');

        act(() => {
          routingHandle?.changeGenomeId('wheat');
        });

        expect(testContext.url).toBe(
          '/genome-browser/wheat?focus=gene:TraesCS3D02G273600&location=3D:1000-1100'
        );
        expect(browserGeneralActions.setActiveGenomeId).toHaveBeenCalledWith(
          'wheat'
        );
      });
    });
  });
});
