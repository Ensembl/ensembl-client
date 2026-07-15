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

import * as urlFor from 'src/shared/helpers/urlHelper';

import SpeciesSelectorMainView from './SpeciesSelectorMainView';
import RouteChecker from 'tests/router/RouteChecker';

import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

const mockUseAppSelector = vi.fn();
const trackSpeciesSearchQuery = vi.fn();

vi.mock('src/store', () => ({
  useAppSelector: (...args: unknown[]) => mockUseAppSelector(...args)
}));

vi.mock(
  'src/content/app/species-selector/hooks/useSpeciesSelectorAnalytics',
  () => ({
    default: () => ({
      trackSpeciesSearchQuery
    })
  })
);

vi.mock('src/shared/helpers/environment', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('src/shared/helpers/environment')>();

  return {
    ...actual,
    isProductionEnvironment: () => true
  };
});

vi.mock(
  'src/content/app/species-selector/state/species-selector-api-slice/speciesSelectorApiSlice',
  () => ({
    useGenomeGroupCategoriesQuery: () => ({ currentData: undefined })
  })
);

vi.mock('src/shared/components/genome-counts/GenomeCounts', () => ({
  default: () => <div>Genome counts</div>
}));

vi.mock(
  'src/content/app/species-selector/components/popular-species-list/PopularSpeciesList',
  () => ({
    default: () => <div>Popular species list</div>
  })
);

vi.mock(
  'src/content/app/species-selector/components/genome-groups/GenomeGroups',
  () => ({
    default: () => <div>Genome groups</div>
  })
);

const committedSpecies: CommittedItem[] = [createSelectedSpecies()];

const renderMainView = () => {
  const routerInfo: { location: Location | null } = {
    location: null
  };

  render(
    <MemoryRouter initialEntries={['/genome-selector']}>
      <SpeciesSelectorMainView />
      <RouteChecker
        setLocation={(location) => {
          routerInfo.location = location;
        }}
      />
    </MemoryRouter>
  );

  return routerInfo;
};

describe('<SpeciesSelectorMainView />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('disables feature search when there are no committed species', () => {
    mockUseAppSelector.mockReturnValue([]);

    renderMainView();

    const featureSearchInput = screen.getByPlaceholderText(
      'Gene, transcript or variant ID...'
    );

    expect(featureSearchInput.getAttribute('disabled')).not.toBeNull();
    const featureSearchForm = featureSearchInput.closest('form');
    expect(featureSearchForm).toBeTruthy();
    expect(
      within(featureSearchForm as HTMLFormElement).getByRole('button', {
        name: 'Find'
      })
    ).toHaveProperty('disabled', true);
  });

  it('navigates to the feature search results route on submit', async () => {
    mockUseAppSelector.mockReturnValue(committedSpecies);

    const routerInfo = renderMainView();
    const featureSearchInput = screen.getByPlaceholderText(
      'Gene, transcript or variant ID...'
    );

    await userEvent.type(featureSearchInput, 'BRCA2');

    const featureSearchForm = featureSearchInput.closest('form');
    await userEvent.click(
      within(featureSearchForm as HTMLFormElement).getByRole('button', {
        name: 'Find'
      })
    );

    expect(routerInfo.location?.pathname).toBe('/search/results');
    expect(routerInfo.location?.search).toBe('?query=BRCA2');
    expect(routerInfo.location?.state).toEqual({
      returnTo: urlFor.speciesSelector()
    });
  });
});
