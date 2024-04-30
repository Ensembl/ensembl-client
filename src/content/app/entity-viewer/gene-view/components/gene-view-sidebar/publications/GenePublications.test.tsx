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
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import set from 'lodash/fp/set';

import createRootReducer from 'src/root/rootReducer';

import GenePublications from './GenePublications';

const defaultProps = {
  gene: {
    symbol: 'BRCA2'
  }
};

const mockState = {
  entityViewer: {
    general: {
      activeGenomeId: 'human-grch38'
    }
  },
  speciesSelector: {
    general: {
      committedItems: [
        {
          genome_id: 'human-grch38',
          common_name: 'human',
          scientific_name: 'Homo sapiens'
        }
      ]
    }
  }
};

const renderComponent = (
  state: typeof mockState = mockState,
  props: typeof defaultProps = defaultProps
) => {
  const store = configureStore({
    reducer: createRootReducer(),
    preloadedState: state as any
  });

  return render(
    <Provider store={store}>
      <GenePublications {...props} />
    </Provider>
  );
};

describe('GenePublications', () => {
  it('does not render if gene does not have a symbol', () => {
    const props = set('gene.symbol', null, defaultProps);
    const { container } = renderComponent(undefined, props);

    expect(container.firstChild).toBeFalsy();
  });

  describe('link to Europe PMC', () => {
    it('contains both common name and scientific name in the query when both are present', () => {
      const { container } = renderComponent();

      const euroPMCLink = [...container.querySelectorAll('a')].find((element) =>
        (element.textContent as string).match('Europe PMC')
      ) as HTMLAnchorElement;

      expect(euroPMCLink).toBeTruthy();

      const expectedLink = `https://europepmc.org/search?query=${encodeURIComponent(
        'BRCA2 ("human" OR "Homo sapiens")'
      )}&sortBy=${encodeURIComponent('CITED+desc')}`;

      expect(euroPMCLink.getAttribute('href')).toBe(expectedLink);
    });

    it('contains only scientific name in the query when species does not have a common name', () => {
      const updatedState = set(
        'speciesSelector.general.committedItems.0.common_name',
        null,
        mockState
      );
      const { container } = renderComponent(updatedState);

      const euroPMCLink = [...container.querySelectorAll('a')].find((element) =>
        (element.textContent as string).match('Europe PMC')
      ) as HTMLAnchorElement;

      expect(euroPMCLink).toBeTruthy();

      const expectedLink = `https://europepmc.org/search?query=${encodeURIComponent(
        'BRCA2 "Homo sapiens"'
      )}&sortBy=${encodeURIComponent('CITED+desc')}`;

      expect(euroPMCLink.getAttribute('href')).toBe(expectedLink);
    });
  });
});
