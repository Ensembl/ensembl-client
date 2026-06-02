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
import { render, screen, waitFor } from '@testing-library/react';

import SearchResultsView from './SearchResultsView';
import RouteChecker from 'tests/router/RouteChecker';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import type { SearchResults } from 'src/shared/types/search-api/search-results';

const mockUseAppSelector = vi.fn();
const useLazySearchGenesQuery = vi.fn();
const useLazySearchTranscriptsQuery = vi.fn();
const useLazySearchVariantsQuery = vi.fn();

vi.mock('src/store', () => ({
  useAppSelector: (...args: unknown[]) => mockUseAppSelector(...args)
}));

vi.mock('src/shared/state/api-slices/searchApiSlice', () => ({
  useLazySearchGenesQuery: () => useLazySearchGenesQuery(),
  useLazySearchTranscriptsQuery: () => useLazySearchTranscriptsQuery(),
  useLazySearchVariantsQuery: () => useLazySearchVariantsQuery()
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

const geneResults: SearchResults = {
  meta: {
    page: 1,
    per_page: 50,
    total: 1
  },
  matches: [
    {
      type: 'Gene',
      stable_id: 'ENSG00000141510',
      unversioned_stable_id: 'ENSG00000141510',
      biotype: 'protein_coding',
      symbol: 'TP53',
      name: 'tumor protein p53',
      genome_id: committedSpecies[0].genome_id,
      transcript_count: 1,
      slice: {
        location: {
          start: 1,
          end: 100
        },
        region: {
          name: '17'
        },
        strand: {
          code: 1
        }
      }
    }
  ]
};

const emptyResults: SearchResults = {
  meta: {
    page: 1,
    per_page: 50,
    total: 0
  },
  matches: []
};

const renderComponent = (initialEntry: string) => {
  const routerInfo: { location: Location | null } = {
    location: null
  };

  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <SearchResultsView />
      <RouteChecker
        setLocation={(location) => {
          routerInfo.location = location;
        }}
      />
    </MemoryRouter>
  );

  return routerInfo;
};

describe('<SearchResultsView />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppSelector.mockReturnValue(committedSpecies);
  });

  it('redirects back to search when query is missing', async () => {
    useLazySearchGenesQuery.mockReturnValue([vi.fn(), {}]);
    useLazySearchTranscriptsQuery.mockReturnValue([vi.fn(), {}]);
    useLazySearchVariantsQuery.mockReturnValue([vi.fn(), {}]);

    const routerInfo = renderComponent('/search/results');

    await waitFor(() => {
      expect(routerInfo.location?.pathname).toBe('/search');
    });
  });

  it('triggers all feature searches using committed species', async () => {
    const triggerGeneSearch = vi.fn();
    const triggerTranscriptSearch = vi.fn();
    const triggerVariantSearch = vi.fn();

    useLazySearchGenesQuery.mockReturnValue([
      triggerGeneSearch,
      {
        currentData: geneResults,
        reset: vi.fn(),
        isFetching: false
      }
    ]);
    useLazySearchTranscriptsQuery.mockReturnValue([
      triggerTranscriptSearch,
      {
        currentData: emptyResults,
        reset: vi.fn(),
        isFetching: false
      }
    ]);
    useLazySearchVariantsQuery.mockReturnValue([
      triggerVariantSearch,
      {
        currentData: emptyResults,
        reset: vi.fn(),
        isFetching: false
      }
    ]);

    renderComponent('/search/results?query=TP53');

    await waitFor(() => {
      expect(triggerGeneSearch).toHaveBeenCalledWith({
        genome_ids: [committedSpecies[0].genome_id],
        query: 'TP53',
        page: 1,
        per_page: 50
      });
    });

    expect(triggerTranscriptSearch).toHaveBeenCalled();
    expect(triggerVariantSearch).toHaveBeenCalled();
    expect(screen.getByText('Search results for "TP53"')).toBeTruthy();
  });
});
