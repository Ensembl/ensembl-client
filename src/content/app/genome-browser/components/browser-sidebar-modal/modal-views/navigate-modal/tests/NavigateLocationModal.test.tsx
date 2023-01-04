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

import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router';
import { render, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import times from 'lodash/times';

import * as browserHelperMethods from 'src/content/app/genome-browser/helpers/browserHelper';
import { getBrowserSidebarModalView } from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSelectors';

import createRootReducer from 'src/root/rootReducer';
import { BrowserSidebarModalView } from 'src/content/app/genome-browser/state/browser-sidebar-modal/browserSidebarModalSlice';

import NavigateLocationModal from '../NavigateLocationModal';

// import { getMockServer, validRegionInput, invalidRegionInput } from './mockValidationServer';
import { getMockServer } from './mockValidationServer';

const generateKaryotype = () =>
  times(10, (n: number) => ({
    is_chromosome: true,
    is_circular: false,
    length: (n + 1) * 1000,
    name: `${n}`,
    type: 'chromosome'
  }));
const mockKaryotype = generateKaryotype();

jest.mock('config', () => ({
  genomeSearchBaseUrl: 'http://location-validation-api' // need to provide absolute urls to the fetch running in Node
}));
jest.mock('src/shared/state/genome/genomeApiSlice', () => {
  const originalModule = jest.requireActual(
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
jest.mock(
  'src/content/app/genome-browser/hooks/useGenomeBrowserIds',
  () => () => ({
    genomeIdForUrl: 'human'
  })
);

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
          <Route path="/" element={<RouteTester />} />
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
      const errorMessage = `Found an unhandled ${req.method} request to ${req.url.href}`;
      throw new Error(errorMessage);
    }
  })
);
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const RouteTester = () => {
  const { pathname } = useLocation();

  return <div data-test-id="route-tester">{pathname}</div>;
};

describe('NavigateLocationModal', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  /*
  remember that in the NavigateRegionModal, the single input should reject an input with a region name
  */

  it('has a switch to NavigateRegionModal', async () => {
    const { getByText, store } = renderComponent();
    const switchElement = getByText('Navigate this region');

    let reduxState = store.getState();
    let modalView = getBrowserSidebarModalView(reduxState);

    // initial redux state; the value doesn't really matter; what matters is that it will be updated
    expect(modalView).toBe(null);

    await userEvent.click(switchElement);

    reduxState = store.getState();
    modalView = getBrowserSidebarModalView(reduxState);

    expect(modalView).toBe(BrowserSidebarModalView.NAVIGATE_REGION);
  });

  describe('segmented input', () => {
    it('disables the single input when interacted with', async () => {
      const { container, getByLabelText } = renderComponent();
      const startCoordinateInput = getByLabelText('Start');
      const singleInput = getByLabelText('Go to');
      const submitButton = container.querySelector('button') as HTMLElement;

      expect(singleInput.hasAttribute('disabled')).toBe(false);

      act(() => {
        startCoordinateInput.focus();
      });

      await waitFor(() => {
        expect(singleInput.hasAttribute('disabled')).toBe(true);
        expect(submitButton.hasAttribute('disabled')).toBe(true);
      });
    });

    // FIXME: this test fails
    it('does not submit location unless all inputs have been filled in', async () => {
      const { getByLabelText } = renderComponent();
      const startCoordinateInput = getByLabelText('Start');
      jest
        .spyOn(browserHelperMethods, 'validateRegion')
        .mockImplementation(jest.fn());

      await userEvent.type(startCoordinateInput, '500{enter}');

      expect(browserHelperMethods.validateRegion).not.toHaveBeenCalled();
      (browserHelperMethods.validateRegion as any).mockRestore();
    });

    // check that we are sending request to location validation endpoint
    it('submits location when the "Go" button is clicked', async () => {
      const { debug, container, getByLabelText, getByTestId } =
        renderComponent();
      const regionSelector = container.querySelector(
        '.select select'
      ) as HTMLSelectElement;
      const startCoordinateInput = getByLabelText('Start');
      const endCoordinateInput = getByLabelText('Start');
      const submitButton = container.querySelector('button') as HTMLElement;

      // parts of the validInput that the mock server knows how to respond to
      await userEvent.selectOptions(regionSelector, '2');
      await userEvent.type(startCoordinateInput, '100');
      await userEvent.type(endCoordinateInput, '1000');

      debug();

      await userEvent.click(submitButton);

      const routeTesterElement = getByTestId('route-tester');

      waitFor(() => {
        // console.log('browserHelperMethods.validateRegion', browserHelperMethods.validateRegion);
        // console.log('routeTesterElement', routeTesterElement.textContent);
        expect(routeTesterElement.textContent).toBe(
          '/human?focus=location:2:100-1000'
        );
      });
    });

    // check that we are sending request to location validation endpoint
    it.todo('submits location when "Enter" key is pressed');

    it.todo('changes the url if the location is valid');

    it.todo('submits location inputs have been filled in');

    it.todo('resets the input elements after submission');

    it.todo('resets the form when "Escape" is pressed');

    it.todo('resets the form when the "Cancel" element is clicked');

    it.todo('displays the wrong location error');
  });

  describe('single input', () => {
    it.todo('disables the inputs by parts when interated with');

    // check that we are sending request to location validation endpoint
    it.todo('submits location when the "Go" button is clicked');

    // check that we are sending request to location validation endpoint
    it.todo('submits location when "Enter" key is pressed');

    it.todo(
      'instructs the genome browser to change the location if it is valid'
    );

    it.todo('submits location inputs have been filled in');

    it.todo('resets the form when "Escape" is pressed');

    it.todo('resets the form when the "Cancel" element is clicked');

    it.todo('resets the input elements after submission');

    it.todo('displays the wrong location error');
  });
});
