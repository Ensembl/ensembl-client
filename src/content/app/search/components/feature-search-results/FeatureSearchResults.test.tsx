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
import { MemoryRouter, type Location } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FeatureSearchResults } from './FeatureSearchResults';
import RouteChecker from 'tests/router/RouteChecker';

import * as urlFor from 'src/shared/helpers/urlHelper';
import { buildFocusIdForUrl } from 'src/shared/helpers/focusObjectHelpers';
import createRootReducer from 'src/root/rootReducer';
import { Strand } from 'src/shared/types/core-api/strand';

import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import type { SearchResults } from 'src/shared/types/search-api/search-results';

const speciesList: CommittedItem[] = [
  createSelectedSpecies({
    genome_tag: 'human'
  })
];

const geneResults: SearchResults = {
  meta: {
    page: 1,
    per_page: 50,
    total_hits: 1
  },
  matches: [
    {
      type: 'Gene',
      stable_id: 'ENSG00000139618',
      unversioned_stable_id: 'ENSG00000139618',
      biotype: 'protein_coding',
      symbol: 'BRCA2',
      name: 'BRCA2 DNA repair associated',
      genome_id: speciesList[0].genome_id,
      transcript_count: 1,
      slice: {
        location: {
          start: 1,
          end: 100
        },
        region: {
          name: '13'
        },
        strand: {
          code: Strand.FORWARD
        }
      }
    }
  ]
};

const renderComponent = (searchResults: SearchResults) => {
  const store = configureStore({
    reducer: createRootReducer()
  });
  const routerInfo: { location: Location | null; navigationType: string } = {
    location: null,
    navigationType: ''
  };

  const renderResult = render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/']}>
        <FeatureSearchResults
          featureType="gene"
          speciesList={speciesList}
          searchResults={searchResults}
        />
        <RouteChecker
          setLocation={(location) => {
            routerInfo.location = location;
          }}
          setNavigationType={(navigationType) => {
            routerInfo.navigationType = navigationType;
          }}
        />
      </MemoryRouter>
    </Provider>
  );

  return {
    ...renderResult,
    routerInfo
  };
};

describe('<FeatureSearchResults />', () => {
  it('renders search result labels as links and shows action columns', () => {
    renderComponent(geneResults);

    expect(
      screen.getByRole('columnheader', { name: 'Genome Browser' })
    ).toBeTruthy();
    expect(
      screen.getByRole('columnheader', { name: 'Entity Viewer' })
    ).toBeTruthy();

    const geneLink = screen
      .getByText('ENSG00000139618')
      .closest('a') as HTMLAnchorElement;

    expect(geneLink).toBeTruthy();
    expect(geneLink.getAttribute('href')).toBe(
      urlFor.browser({
        genomeId: 'human',
        focus: buildFocusIdForUrl({
          type: 'gene',
          objectId: 'ENSG00000139618'
        })
      })
    );
  });

  it('navigates via the genome browser action button', async () => {
    const { container, routerInfo } = renderComponent(geneResults);

    const genomeBrowserButton = container.querySelector(
      '[data-test-id="genomeBrowser"] button'
    ) as HTMLButtonElement;

    await userEvent.click(genomeBrowserButton);

    const expectedUrl = urlFor.browser({
      genomeId: 'human',
      focus: buildFocusIdForUrl({
        type: 'gene',
        objectId: 'ENSG00000139618'
      })
    });

    expect(
      `${routerInfo.location?.pathname}${routerInfo.location?.search}`
    ).toBe(expectedUrl);
    expect(routerInfo.navigationType).toBe('PUSH');
  });

  it('shows the simplified empty state when emptyResultsLabel is provided', () => {
    render(
      <Provider
        store={configureStore({
          reducer: createRootReducer()
        })}
      >
        <MemoryRouter initialEntries={['/']}>
          <FeatureSearchResults
            featureType="gene"
            speciesList={speciesList}
            searchResults={{
              meta: {
                page: 1,
                per_page: 50,
                total_hits: 0
              },
              matches: []
            }}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('No results found')).toBeTruthy();
  });
});
