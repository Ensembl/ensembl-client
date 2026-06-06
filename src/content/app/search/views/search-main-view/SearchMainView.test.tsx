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

import { MemoryRouter, type Location } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SearchMainView from './SearchMainView';
import RouteChecker from 'tests/router/RouteChecker';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

const mockUseAppSelector = vi.fn();

vi.mock('src/store', () => ({
  useAppSelector: (...args: unknown[]) => mockUseAppSelector(...args)
}));

const committedSpecies: CommittedItem[] = [
  {
    genome_id: 'homo_sapiens_GCA_000001405_29',
    genome_tag: 'human',
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    species_taxonomy_id: '9606',
    type: null,
    is_reference: true,
    assembly: {
      accession_id: 'GCA_000001405.29',
      name: 'GRCh38'
    },
    release: {
      name: 'Sep 2025',
      type: 'integrated'
    },
    isEnabled: true,
    addedAt: 1
  }
];

const renderComponent = () => {
  const routerInfo: { location: Location | null } = {
    location: null
  };

  render(
    <MemoryRouter initialEntries={['/search']}>
      <SearchMainView />
      <RouteChecker
        setLocation={(location) => {
          routerInfo.location = location;
        }}
      />
    </MemoryRouter>
  );

  return routerInfo;
};

describe('<SearchMainView />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppSelector.mockReturnValue(committedSpecies);
  });

  it('navigates to search results on feature search submit', async () => {
    const routerInfo = renderComponent();
    const featureSearchInput = screen.getByPlaceholderText(
      'Gene, transcript or variant ID...'
    );

    await userEvent.type(featureSearchInput, 'TP53');

    const featureSearchForm = featureSearchInput.closest('form');
    await userEvent.click(
      within(featureSearchForm as HTMLFormElement).getByRole('button', {
        name: 'Find'
      })
    );

    expect(routerInfo.location?.pathname).toBe('/search/results');
    expect(routerInfo.location?.search).toBe('?query=TP53');
    expect(routerInfo.location?.state).toEqual({
      returnTo: '/search'
    });
  });
});
