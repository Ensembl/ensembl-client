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

import InterstitialSearch, {
  Props as InterstitialSearchProps
} from './InterstitialSearch';

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

const defaultProps: InterstitialSearchProps = {
  app: 'genomeBrowser',
  genomeId: faker.string.uuid(),
  genomeIdForUrl: 'human'
};

describe('<InterstitialSearch />', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial rendering', () => {
    it('renders with interstitial mode', () => {
      const { container } = render(
        <Provider store={getStore()}>
          <InterstitialSearch {...defaultProps} />
        </Provider>
      );

      const interstitialSearch = container.querySelector('.interstitialSearch');
      expect(interstitialSearch).toBeTruthy();
    });

    it('does not show search matches initially', () => {
      const { container } = render(
        <Provider store={getStore()}>
          <InterstitialSearch {...defaultProps} />
        </Provider>
      );

      const resultsContainer = container.querySelector('.resultsContainer');
      const searchMatches = container.querySelector('.searchMatches');

      expect(resultsContainer).toBeTruthy();
      expect(searchMatches).toBeFalsy();
    });
  });
});
