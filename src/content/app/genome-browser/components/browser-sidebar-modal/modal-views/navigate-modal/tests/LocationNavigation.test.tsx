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

import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { render, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import times from 'lodash/times';

import * as browserHelperMethods from 'src/content/app/genome-browser/helpers/browserHelper';

import createRootReducer from 'src/root/rootReducer';

import NavigateLocationModal from '../LocationNavigation';

import {
  getMockServer,
  validLocationInput,
  invalidLocationInput,
  invalidLocationResponse
} from './mockValidationServer';

const generateKaryotype = () =>
  times(10, (n: number) => ({
    is_chromosome: true,
    is_circular: false,
    length: (n + 1) * 1000,
    name: `${n}`,
    type: 'chromosome'
  }));
const mockKaryotype = generateKaryotype();

vi.mock('config', () => ({
  default: {
    metadataApiBaseUrl: 'http://location-validation-api' // need to provide absolute urls to the fetch running in Node
  }
}));
vi.mock('src/shared/state/genome/genomeApiSlice', async () => {
  const originalModule = await vi.importActual(
    'src/shared/state/genome/genomeApiSlice'
  );

  return {
    ...originalModule,
    useGenomeKaryotypeQuery: () => ({
      data: mockKaryotype,
      currentData: mockKaryotype
    })
  };
});
vi.mock('src/content/app/genome-browser/hooks/useGenomeBrowserIds', () => ({
  default: () => ({
    genomeIdForUrl: 'human'
  })
}));

const renderComponent = () => {
  const initialState = {
    browser: {
      browserGeneral: {
        activeGenomeId: 'human'
      }
    }
  };

  const store = configureStore({
    reducer: createRootReducer(),
    // middleware: (getDefaultMiddleware) =>
    //   getDefaultMiddleware().concat([restApiSlice.middleware]),
    preloadedState: initialState as any
  });

  const renderResult = render(
    <MemoryRouter initialEntries={['/']}>
      <Provider store={store}>
        <NavigateLocationModal />
        <Routes>
          <Route path="*" element={<RouteTester />} />
        </Routes>
      </Provider>
    </MemoryRouter>
  );

  return {
    ...renderResult,
    store
  };
};

const server = getMockServer();

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

const RouteTester = () => {
  const { pathname, search } = useLocation();

  return (
    <div data-test-id="route-tester">
      {pathname}
      {search}
    </div>
  );
};

describe('<LocationNavigation />', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('segmented input', () => {
    it('disables the single input when interacted with', () => {
      const { container, getByLabelText } = renderComponent();
      const startCoordinateInput = getByLabelText('Start');
      const singleInput = getByLabelText('Go to');
      const submitButton = container.querySelector('button') as HTMLElement;

      expect(singleInput.hasAttribute('disabled')).toBe(false);

      act(() => {
        startCoordinateInput.focus();
      });

      expect(singleInput.hasAttribute('disabled')).toBe(true);
      expect(submitButton.hasAttribute('disabled')).toBe(true);
    });

    it('does not submit location unless all inputs have been filled in', async () => {
      const { getByLabelText } = renderComponent();
      const startCoordinateInput = getByLabelText('Start');
      vi.spyOn(
        browserHelperMethods,
        'validateGenomicLocation'
      ).mockImplementation(vi.fn());

      await userEvent.type(startCoordinateInput, '500{enter}');

      expect(
        browserHelperMethods.validateGenomicLocation
      ).not.toHaveBeenCalled();
      (browserHelperMethods.validateGenomicLocation as any).mockRestore();
    });

    // check that we are sending request to location validation endpoint
    it('submits location when the "Go" button is clicked', async () => {
      const { container, getByLabelText, getByTestId } = renderComponent();
      const regionSelector = container.querySelector(
        '.select select'
      ) as HTMLSelectElement;
      const startCoordinateInput = getByLabelText('Start') as HTMLInputElement;
      const endCoordinateInput = getByLabelText('End') as HTMLInputElement;
      const submitButton = container.querySelector('button') as HTMLElement;

      // parts of the validInput that the mock server knows how to respond to
      await userEvent.selectOptions(regionSelector, '2');
      await userEvent.type(startCoordinateInput, '100');
      await userEvent.type(endCoordinateInput, '1000');

      await userEvent.click(submitButton);

      const routeTesterElement = getByTestId('route-tester');

      await waitFor(() => {
        const observedRoute = routeTesterElement.textContent;
        expect(observedRoute).toBe(
          '/genome-browser/human?focus=location:2:100-1000'
        );
      });

      // the form should have been cleared upon successful submission
      expect(startCoordinateInput.value).toBe('');
      expect(endCoordinateInput.value).toBe('');
      expect(regionSelector.value).toBe('');
    });

    // check that we are sending request to location validation endpoint
    it('submits location when "Enter" key is pressed', async () => {
      const { container, getByLabelText, getByTestId } = renderComponent();
      const regionSelector = container.querySelector(
        '.select select'
      ) as HTMLSelectElement;
      const startCoordinateInput = getByLabelText('Start') as HTMLInputElement;
      const endCoordinateInput = getByLabelText('End') as HTMLInputElement;

      // parts of the validInput that the mock server knows how to respond to
      await userEvent.selectOptions(regionSelector, '2');
      await userEvent.type(startCoordinateInput, '100');
      await userEvent.type(endCoordinateInput, '1000{enter}');

      const routeTesterElement = getByTestId('route-tester');

      await waitFor(() => {
        const observedRoute = routeTesterElement.textContent;
        expect(observedRoute).toBe(
          '/genome-browser/human?focus=location:2:100-1000'
        );
      });

      // the form should have been cleared upon successful submission
      expect(startCoordinateInput.value).toBe('');
      expect(endCoordinateInput.value).toBe('');
      expect(regionSelector.value).toBe('');
    });

    it('resets the form when the "Cancel" element is clicked', async () => {
      const { container, getByLabelText, getByText } = renderComponent();
      const regionSelector = container.querySelector(
        '.select select'
      ) as HTMLSelectElement;
      const startCoordinateInput = getByLabelText('Start') as HTMLInputElement;
      const endCoordinateInput = getByLabelText('End') as HTMLInputElement;
      const singleInput = getByLabelText('Go to');

      // prefill the fields with data; doesn't matter which
      await userEvent.selectOptions(regionSelector, '1');
      await userEvent.type(startCoordinateInput, 'foo');
      await userEvent.type(endCoordinateInput, 'bar');

      // notice that the Cancel element should only be present after the form starts getting filled
      const cancelElement = getByText('Cancel');
      await userEvent.click(cancelElement);

      // the form should have been cleared
      expect(startCoordinateInput.value).toBe('');
      expect(endCoordinateInput.value).toBe('');
      expect(regionSelector.value).toBe('');
      expect(singleInput.hasAttribute('disabled')).toBe(false);
    });

    it('resets the form when "Escape" is pressed', async () => {
      const { getByLabelText } = renderComponent();
      const startCoordinateInput = getByLabelText('Start') as HTMLInputElement;
      const singleInput = getByLabelText('Go to');

      // start fillinf in the input; then escape
      await userEvent.type(startCoordinateInput, 'foo{escape}');

      // the form should have been cleared
      expect(startCoordinateInput.value).toBe('');
      expect(singleInput.hasAttribute('disabled')).toBe(false);
    });

    it('displays the wrong location error', async () => {
      server.use(
        http.get(
          'http://location-validation-api/validate_location',
          () => {
            return HttpResponse.json(invalidLocationResponse);
          },
          {
            once: true
          }
        )
      );

      const { container, getByLabelText } = renderComponent();
      const regionSelector = container.querySelector(
        '.select select'
      ) as HTMLSelectElement;
      const startCoordinateInput = getByLabelText('Start') as HTMLInputElement;
      const endCoordinateInput = getByLabelText('End') as HTMLInputElement;

      // parts of the validInput that the mock server knows how to respond to
      await userEvent.selectOptions(regionSelector, '2');
      await userEvent.type(startCoordinateInput, '100');
      await userEvent.type(endCoordinateInput, '2000{enter}'); // making the location different from the valid location; the server responds with a valid response otherwise

      await waitFor(() => {
        const errorElement = container.querySelector('.errorMessage');
        expect(errorElement).toBeTruthy();
      });
    });
  });

  describe('single input', () => {
    it('disables the segmented input when interacted with', async () => {
      const { container, getByLabelText } = renderComponent();
      const regionSelector = container.querySelector(
        '.select select'
      ) as HTMLSelectElement;
      const startCoordinateInput = getByLabelText('Start');
      const singleInput = getByLabelText('Go to');
      const submitButton = container.querySelector('button') as HTMLElement;

      expect(regionSelector.hasAttribute('disabled')).toBe(false);
      expect(startCoordinateInput.hasAttribute('disabled')).toBe(false);

      act(() => {
        singleInput.focus();
      });

      expect(regionSelector.hasAttribute('disabled')).toBe(true);
      expect(startCoordinateInput.hasAttribute('disabled')).toBe(true);
      expect(submitButton.hasAttribute('disabled')).toBe(true);

      // typing something in the single location input should enable the "Go" button
      await userEvent.type(singleInput, 'foo');

      expect(submitButton.hasAttribute('disabled')).toBe(false);
    });

    // check that we are sending request to location validation endpoint
    it('submits location when the "Go" button is clicked', async () => {
      const { container, getByLabelText, getByTestId } = renderComponent();
      const singleInput = getByLabelText('Go to') as HTMLInputElement;
      const submitButton = container.querySelector('button') as HTMLElement;

      await userEvent.type(singleInput, validLocationInput);

      await userEvent.click(submitButton);

      const routeTesterElement = getByTestId('route-tester');

      await waitFor(() => {
        const observedRoute = routeTesterElement.textContent;
        expect(observedRoute).toBe(
          '/genome-browser/human?focus=location:2:100-1000'
        );
      });

      // the form should have been cleared upon successful submission
      expect(singleInput.value).toBe('');
    });

    // check that we are sending request to location validation endpoint
    it('submits location when "Enter" key is pressed', async () => {
      const { getByLabelText, getByTestId } = renderComponent();
      const singleInput = getByLabelText('Go to') as HTMLInputElement;

      await userEvent.type(singleInput, `${validLocationInput}{enter}`);

      const routeTesterElement = getByTestId('route-tester');

      await waitFor(() => {
        const observedRoute = routeTesterElement.textContent;
        expect(observedRoute).toBe(
          '/genome-browser/human?focus=location:2:100-1000'
        );
      });

      // the form should have been cleared upon successful submission
      expect(singleInput.value).toBe('');
    });

    it('resets the form when "Escape" is pressed', async () => {
      const { container, getByLabelText } = renderComponent();
      const startCoordinateInput = getByLabelText('Start');
      const singleInput = getByLabelText('Go to') as HTMLInputElement;
      const submitButton = container.querySelector('button') as HTMLElement;

      await userEvent.type(singleInput, `foo`);

      expect(startCoordinateInput.hasAttribute('disabled')).toBe(true);

      await userEvent.type(singleInput, `{escape}`);

      expect(singleInput.value).toBe('');
      expect(startCoordinateInput.hasAttribute('disabled')).toBe(false);
      expect(submitButton.hasAttribute('disabled')).toBe(true);
    });

    it('resets the form when the "Cancel" element is clicked', async () => {
      const { container, getByLabelText, getByText } = renderComponent();
      const singleInput = getByLabelText('Go to') as HTMLInputElement;
      const submitButton = container.querySelector('button') as HTMLElement;

      await userEvent.type(singleInput, `foo`);

      // notice that the Cancel element should only be present after the form starts getting filled
      const cancelElement = getByText('Cancel');

      await userEvent.click(cancelElement);

      expect(singleInput.value).toBe('');
      expect(submitButton.hasAttribute('disabled')).toBe(true);
    });

    it('displays the wrong location error', async () => {
      const { container, getByLabelText } = renderComponent();
      const singleInput = getByLabelText('Go to') as HTMLInputElement;

      await userEvent.type(singleInput, `${invalidLocationInput}{enter}`);

      await waitFor(() => {
        const errorElement = container.querySelector('.errorMessage');
        expect(errorElement).toBeTruthy();
      });
    });
  });
});
