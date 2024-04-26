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

import { faker } from '@faker-js/faker';
import { render, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import merge from 'lodash/fp/merge';

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

import restApiSlice from 'src/shared/state/api-slices/restSlice';

import createRootReducer from 'src/root/rootReducer';

import { BrowserLocationIndicator } from './BrowserLocationIndicator';

import type { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

const humanChromosomeName = '13';
const bacterialChromosomeName = 'Chromosome';
const startPosition = faker.number.int({ min: 1, max: 1000000 });
const endPosition =
  startPosition + faker.number.int({ min: 1000, max: 1000000 });
const mockHumanKaryotype = [{ is_circular: false, name: humanChromosomeName }];
const mockBacteriumKaryotype = [
  { is_circular: true, name: bacterialChromosomeName }
];

const mockMetadataApiUrl = 'http://metadata-api';

jest.mock('config', () => ({
  metadataApiBaseUrl: 'http://metadata-api'
}));

jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowserAnalytics',
  () => () => jest.fn()
);

const server = setupServer(
  http.get(`${mockMetadataApiUrl}/genome/:genomeId/karyotype`, ({ params }) => {
    const { genomeId } = params;

    if (genomeId === 'human') {
      return HttpResponse.json(mockHumanKaryotype);
    } else if (genomeId === 'ecoli') {
      return HttpResponse.json(mockBacteriumKaryotype);
    }
  })
);

const initialReduxState = {
  browser: {
    browserGeneral: {
      actualChrLocations: {
        human: [humanChromosomeName, startPosition, endPosition] as ChrLocation,
        ecoli: [
          bacterialChromosomeName,
          startPosition,
          endPosition
        ] as ChrLocation
      },
      activeGenomeId: 'human'
    }
  }
};

const renderBrowserLocationIndicator = ({
  state = {}
}: {
  state?: Partial<typeof initialReduxState>;
} = {}) => {
  const initialState = merge(initialReduxState, state);

  const store = configureStore({
    reducer: createRootReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat([restApiSlice.middleware]),
    preloadedState: initialState as any
  });

  const renderResult = render(
    <Provider store={store}>
      <BrowserLocationIndicator />
    </Provider>
  );

  return {
    ...renderResult,
    store
  };
};

beforeAll(() =>
  server.listen({
    onUnhandledRequest(req) {
      const errorMessage = `Found an unhandled ${req.method} request to ${req.url}`;
      throw new Error(errorMessage);
    }
  })
);
afterAll(() => server.close());

describe('BrowserLocationIndicator', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('displays chromosome name', async () => {
      const { container } = renderBrowserLocationIndicator();
      await waitFor(() => {
        const renderedName = container.querySelector('.regionName');
        expect(renderedName?.textContent).toBe(humanChromosomeName);
      });
    });

    it('displays circular chromosome', async () => {
      const { container } = renderBrowserLocationIndicator({
        state: {
          browser: { browserGeneral: { activeGenomeId: 'ecoli' } }
        } as any
      });
      await waitFor(() => {
        const circularIndicator = container.querySelector('.circularIndicator');
        expect(circularIndicator).toBeTruthy();
      });
    });

    it('displays location', async () => {
      const { container } = renderBrowserLocationIndicator();
      await waitFor(() => {
        const renderedLocation = container.querySelector('.chrRegion');
        expect(renderedLocation?.textContent).toBe(
          `${formatNumber(startPosition)}-${formatNumber(endPosition)}`
        );
      });
    });
  });
});
