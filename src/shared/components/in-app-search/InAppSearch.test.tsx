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

import featureSearchReducer from 'src/shared/state/feature-search/featureSearchSlice';

import InAppSearch, { Props as InAppSearchProps } from './InAppSearch';

const rootReducer = {
  featureSearch: featureSearchReducer
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
  genomeTag: 'human'
};

describe('<InAppSearch />', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial rendering', () => {
    it('renders correctly before the request', () => {
      const { container } = render(
        <Provider store={getStore()}>
          <InAppSearch {...defaultProps} />
        </Provider>
      );

      const inAppSearch = container.querySelector('.inAppSearch');
      expect(inAppSearch).toBeTruthy();
    });

    it('renders with interstitial mode', () => {
      const { container } = render(
        <Provider store={getStore()}>
          <InAppSearch {...defaultProps} />
        </Provider>
      );

      const inAppSearch = container.querySelector('.inAppSearch');
      expect(inAppSearch).toBeTruthy();
    });

    it('does not show results initially', () => {
      const { container } = render(
        <Provider store={getStore()}>
          <InAppSearch {...defaultProps} />
        </Provider>
      );

      const resultsContainer = container.querySelector('.resultsContainer');
      const searchMatches = container.querySelector('.searchMatches');

      expect(resultsContainer).toBeTruthy();
      expect(searchMatches).toBeFalsy();
    });
  });
});
