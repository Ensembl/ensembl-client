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

import { render } from 'vitest-browser-react';
import { page, userEvent } from 'vitest/browser';
import { faker } from '@faker-js/faker';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, useLocation } from 'react-router';
import { setupWorker } from 'msw/browser';
import { http, HttpResponse, passthrough } from 'msw';
import merge from 'lodash/fp/merge';

import { formatNumber } from 'src/shared/helpers/formatters/numberFormatter';

import restApiSlice from 'src/shared/state/api-slices/restSlice';

import createRootReducer from 'src/root/rootReducer';

import { BrowserLocationIndicator } from './BrowserLocationIndicator';

import type { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';

const humanChromosomeName = '13';
const startPosition = faker.number.int({ min: 1, max: 1000000 });
const endPosition =
  startPosition + faker.number.int({ min: 1000, max: 1000000 });

const mockMetadataApiUrl = 'http://metadata-api';

vi.mock('config', () => ({
  default: {
    metadataApiBaseUrl: 'http://metadata-api'
  }
}));

vi.mock('src/content/app/genome-browser/hooks/useGenomeBrowserIds', () => ({
  default: () => ({
    activeGenomeId: 'human',
    genomeIdForUrl: 'human'
  })
}));

const requestHandlers = [
  http.get(`${mockMetadataApiUrl}/validate_location`, ({ request }) => {
    const url = new URL(request.url);
    const locationParam = url.searchParams.get('location');

    const responsePayload = { location: locationParam };

    return HttpResponse.json(responsePayload);
  }),
  http.all('*', () => {
    return passthrough();
  })
];

const worker = setupWorker(...requestHandlers);

const initialReduxState = {
  browser: {
    browserGeneral: {
      actualChrLocations: {
        human: [humanChromosomeName, startPosition, endPosition] as ChrLocation
      },
      activeGenomeId: 'human'
    }
  }
};

const LocationTracker = () => {
  const location = useLocation();
  const stringifiedUrl = `${location.pathname}?${location.search}`;
  return <div data-testid="location-checker">{stringifiedUrl}</div>;
};

const renderBrowserLocationIndicator = async ({
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

  const renderResult = await render(
    <MemoryRouter initialEntries={['/genome-browser/human']}>
      <Provider store={store}>
        <BrowserLocationIndicator />
        <LocationTracker />
      </Provider>
    </MemoryRouter>
  );

  return {
    ...renderResult,
    store
  };
};

beforeAll(() =>
  worker.start({
    onUnhandledRequest(req) {
      const errorMessage = `Found an unhandled ${req.method} request to ${req.url}`;
      throw new Error(errorMessage);
    },
    quiet: true // Don't print diagnostic messages to the console
  })
);
afterAll(() => worker.stop());

describe('BrowserLocationIndicator', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('displays an input field with current genome browser location', async () => {
    await renderBrowserLocationIndicator();

    const expectedLocationString = `${humanChromosomeName}:${formatNumber(
      startPosition
    )}-${formatNumber(endPosition)}`;

    const input = page.getByRole('textbox');

    await expect.element(input).toHaveValue(expectedLocationString);
  });

  it('updates url upon successful submission', async () => {
    await renderBrowserLocationIndicator();
    const input = page.getByRole('textbox');
    const newLocation = `1:1000-10000`;

    await userEvent.type(input, `${newLocation}{enter}`);

    await vi.waitFor(() => {
      const locationChecker = page.getByTestId('location-checker').element();
      const locationCheckerTextContent = locationChecker.textContent;
      expect(locationCheckerTextContent).toContain(newLocation);
    });
  });

  it('updates url on button press', async () => {
    await renderBrowserLocationIndicator();
    const input = page.getByRole('textbox');
    const submitButton = page.getByText('Go');
    const newLocation = `1:1000-10000`;

    await userEvent.type(input, newLocation);
    await userEvent.click(submitButton);

    await vi.waitFor(() => {
      const locationChecker = page.getByTestId('location-checker').element();
      const locationCheckerTextContent = locationChecker.textContent;
      expect(locationCheckerTextContent).toContain(newLocation);
    });
  });

  it('displays warning on invalid submission', async () => {
    // force the mocked endpoint to invalidate the location
    worker.use(
      http.get(
        `${mockMetadataApiUrl}/validate_location`,
        () => {
          return HttpResponse.json({ location: null });
        },
        { once: true }
      )
    );

    await renderBrowserLocationIndicator();
    const input = page.getByRole('textbox');

    await userEvent.type(input, 'invalid{enter}');

    await vi.waitFor(() => {
      const warningLocator = page.getByText('Invalid location');
      expect(warningLocator).toBeVisible();
    });
  });
});
