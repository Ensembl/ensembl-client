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
import { render, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as inAppSearchSlice from 'src/shared/state/in-app-search/inAppSearchSlice';
import inAppSearchReducer from 'src/shared/state/in-app-search/inAppSearchSlice';

import InAppSearch, { Props as InAppSearchProps } from './InAppSearch';

import { brca2SearchResults } from './test/response-fixture';

const rootReducer = {
  inAppSearch: inAppSearchReducer
};

const getStore = (initialState = {}) => {
  return configureStore({
    reducer: rootReducer,
    devTools: false,
    preloadedState: initialState
  });
};

const defaultProps: InAppSearchProps = {
  app: 'genomeBrowser',
  genomeId: 'human',
  mode: 'interstitial'
};

describe('<InAppSearch />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initial rendering', () => {
    it('renders correctly before the request', () => {
      const { container, queryByText } = render(
        <Provider store={getStore()}>
          <InAppSearch {...defaultProps} />
        </Provider>
      );

      const searchField = container.querySelector('.searchField');
      expect(searchField).toBeTruthy();

      const label = queryByText('Find a gene in this species');
      expect(label).toBeTruthy();

      const button = container.querySelector('button');
      expect(button).toBeTruthy();
      expect(button?.getAttribute('disabled')).not.toBe(null);
    });

    it('uses the mode property correctly', () => {
      const { rerender, queryByTestId } = render(
        <Provider store={getStore()}>
          <InAppSearch {...defaultProps} />
        </Provider>
      );

      let inAppSearchTop = queryByTestId('in-app search top') as HTMLElement;
      expect(
        inAppSearchTop.classList.contains('inAppSearchTopInterstitial')
      ).toBe(true);

      const sidebarProps = { ...defaultProps, mode: 'sidebar' as const };
      rerender(
        <Provider store={getStore()}>
          <InAppSearch {...sidebarProps} />
        </Provider>
      );

      inAppSearchTop = queryByTestId('in-app search top') as HTMLElement;
      expect(inAppSearchTop.classList.contains('inAppSearchTopSidebar')).toBe(
        true
      );
    });
  });

  describe('search', () => {
    beforeAll(() => {
      global.fetch = jest.fn().mockImplementation(
        () =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(brca2SearchResults)
          }) as any
      );
    });

    it('handles query submission', async () => {
      // check that correct arguments are passed to the search function
      jest
        .spyOn(inAppSearchSlice, 'search')
        .mockImplementation(() => ({ type: 'action' } as any));

      const { container, rerender } = render(
        <Provider store={getStore()}>
          <InAppSearch {...defaultProps} />
        </Provider>
      );

      const searchField = container.querySelector(
        '.searchField input'
      ) as HTMLInputElement;

      userEvent.type(searchField, 'BRCA2');
      await act(async () => {
        // this starts an async process that causes component's state update; therefore should be wrapped in 'act'
        userEvent.type(searchField, '{enter}');
      });

      const [search1Args] = (inAppSearchSlice.search as any).mock.calls[0];
      expect(search1Args).toEqual({
        app: defaultProps.app,
        genome_id: defaultProps.genomeId,
        query: 'BRCA2',
        page: 1,
        per_page: 50
      });

      // let's try passing a different app name and a different genome id in props
      rerender(
        <Provider store={getStore()}>
          <InAppSearch {...defaultProps} app="entityViewer" genomeId="wheat" />
        </Provider>
      );

      userEvent.type(searchField, 'Traes');

      // also, let's try to submit the search by pressing on the button
      const submitButton = container.querySelector('button') as HTMLElement;
      await act(async () => {
        // this starts an async process that causes component's state update; therefore should be wrapped in 'act'
        userEvent.click(submitButton);
      });

      const [search2Args] = (inAppSearchSlice.search as any).mock.calls[1];
      expect(search2Args).toEqual({
        app: 'entityViewer',
        genome_id: 'wheat',
        query: 'Traes',
        page: 1,
        per_page: 50
      });
      (inAppSearchSlice.search as any).mockRestore();
    });

    it('displays search results', async () => {
      const { container } = render(
        <Provider store={getStore()}>
          <InAppSearch {...defaultProps} />
        </Provider>
      );

      const searchField = container.querySelector(
        '.searchField input'
      ) as HTMLInputElement;
      userEvent.type(searchField, 'BRCA2{enter}');

      await waitFor(() => {
        const hitsCount = container.querySelector('.hitsCount');
        expect(hitsCount).toBeTruthy();
      });

      // now we can test the results in the DOM
      expect(container.querySelector('.hitsCount')?.textContent).toBe(
        '12 genes'
      ); // as defined in the fixture
      expect(container.querySelectorAll('.searchMatch').length).toBe(10); // as defined in the fixture; 10 matches per page
    });
  });
});
