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

import SpeciesSelectorSearchResultsView from './SpeciesSelectorSearchResultsView';
import RouteChecker from 'tests/router/RouteChecker';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import type { SearchResults } from 'src/shared/types/search-api/search-results';
import { Strand } from 'src/shared/types/core-api/strand';

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
      genome_id: committedSpecies[0].genome_id,
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

const emptyResults: SearchResults = {
  meta: {
    page: 1,
    per_page: 50,
    total_hits: 0
  },
  matches: []
};

const renderComponent = (initialEntry: string) => {
  const routerInfo: { location: Location | null } = {
    location: null
  };

  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <SpeciesSelectorSearchResultsView />
      <RouteChecker
        setLocation={(location) => {
          routerInfo.location = location;
        }}
      />
    </MemoryRouter>
  );

  return routerInfo;
};

describe('<SpeciesSelectorSearchResultsView />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppSelector.mockReturnValue(committedSpecies);
  });

  it('redirects back to species selector when query is missing', async () => {
    useLazySearchGenesQuery.mockReturnValue([vi.fn(), {}]);
    useLazySearchTranscriptsQuery.mockReturnValue([vi.fn(), {}]);
    useLazySearchVariantsQuery.mockReturnValue([vi.fn(), {}]);

    const routerInfo = renderComponent('/species-selector/search/results');

    await waitFor(() => {
      expect(routerInfo.location?.pathname).toBe('/species-selector');
    });
  });

  it('redirects back to species selector when there are no committed species', async () => {
    const triggerGeneSearch = vi.fn();
    const triggerTranscriptSearch = vi.fn();
    const triggerVariantSearch = vi.fn();

    mockUseAppSelector.mockReturnValue([]);
    useLazySearchGenesQuery.mockReturnValue([
      triggerGeneSearch,
      {
        reset: vi.fn()
      }
    ]);
    useLazySearchTranscriptsQuery.mockReturnValue([
      triggerTranscriptSearch,
      {
        reset: vi.fn()
      }
    ]);
    useLazySearchVariantsQuery.mockReturnValue([
      triggerVariantSearch,
      {
        reset: vi.fn()
      }
    ]);

    const routerInfo = renderComponent(
      '/species-selector/search/results?query=brca'
    );

    await waitFor(() => {
      expect(routerInfo.location?.pathname).toBe('/species-selector');
    });

    expect(triggerGeneSearch).not.toHaveBeenCalled();
    expect(triggerTranscriptSearch).not.toHaveBeenCalled();
    expect(triggerVariantSearch).not.toHaveBeenCalled();
  });

  it('triggers all feature searches for committed species and shows populated sections first', async () => {
    const triggerGeneSearch = vi.fn();
    const triggerTranscriptSearch = vi.fn();
    const triggerVariantSearch = vi.fn();
    const resetGeneSearchResults = vi.fn();
    const resetTranscriptSearchResults = vi.fn();
    const resetVariantSearchResults = vi.fn();

    useLazySearchGenesQuery.mockReturnValue([
      triggerGeneSearch,
      {
        currentData: geneResults,
        reset: resetGeneSearchResults,
        isFetching: false
      }
    ]);
    useLazySearchTranscriptsQuery.mockReturnValue([
      triggerTranscriptSearch,
      {
        currentData: emptyResults,
        reset: resetTranscriptSearchResults,
        isFetching: false
      }
    ]);
    useLazySearchVariantsQuery.mockReturnValue([
      triggerVariantSearch,
      {
        currentData: emptyResults,
        reset: resetVariantSearchResults,
        isFetching: false
      }
    ]);

    renderComponent('/species-selector/search/results?query=BRCA2');

    await waitFor(() => {
      expect(triggerGeneSearch).toHaveBeenCalledWith({
        genome_ids: [committedSpecies[0].genome_id],
        query: 'BRCA2',
        page: 1,
        per_page: 50
      });
    });

    expect(resetGeneSearchResults).toHaveBeenCalled();
    expect(resetTranscriptSearchResults).toHaveBeenCalled();
    expect(resetVariantSearchResults).toHaveBeenCalled();
    expect(triggerTranscriptSearch).toHaveBeenCalled();
    expect(triggerVariantSearch).toHaveBeenCalled();

    const sectionHeadings = [
      screen.getByText('Gene search results'),
      screen.getByText('Transcript search results'),
      screen.getByText('Variant search results')
    ].map((heading) => heading.textContent);

    expect(sectionHeadings).toEqual([
      'Gene search results',
      'Transcript search results',
      'Variant search results'
    ]);
  });

  it('shows the variant error message instead of a result table for missing resources', async () => {
    useLazySearchGenesQuery.mockReturnValue([
      vi.fn(),
      {
        currentData: emptyResults,
        reset: vi.fn(),
        isFetching: false
      }
    ]);
    useLazySearchTranscriptsQuery.mockReturnValue([
      vi.fn(),
      {
        currentData: emptyResults,
        reset: vi.fn(),
        isFetching: false
      }
    ]);
    useLazySearchVariantsQuery.mockReturnValue([
      vi.fn(),
      {
        currentData: undefined,
        error: {
          status: 404,
          data: {
            detail: 'Variants are not available for this species.'
          }
        },
        reset: vi.fn(),
        isFetching: false
      }
    ]);

    renderComponent('/species-selector/search/results?query=rs699');

    expect(
      await screen.findByText('Variants are not available for this species.')
    ).toBeTruthy();
  });
});
