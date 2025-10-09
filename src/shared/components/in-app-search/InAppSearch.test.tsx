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
import { render } from '@testing-library/react';
import { faker } from '@faker-js/faker';

import inAppSearchReducer from 'src/shared/state/in-app-search/inAppSearchSlice';

import InAppSearch, { Props as InAppSearchProps } from './InAppSearch';

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
  genomeId: faker.string.uuid(),
  genomeIdForUrl: 'human',
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
});
