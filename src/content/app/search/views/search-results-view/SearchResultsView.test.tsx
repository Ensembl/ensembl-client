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

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SearchResultsView from './SearchResultsView';

import {
  getCommittedSpecies,
  getHasLoadedStoredSpecies
} from 'src/content/app/species-selector/state/species-selector-general-slice/speciesSelectorGeneralSelectors';

import { createSelectedSpecies } from 'tests/fixtures/selected-species';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';
import type { SearchResults } from 'src/shared/types/search-api/search-results';
import { Strand } from 'src/shared/types/core-api/strand';

const mockUseAppSelector = vi.fn();
const mockNavigate = vi.fn();
const mockSetSearchParams = vi.fn();
const mockSearchParams = new URLSearchParams('');
let mockLocationState: unknown = null;
const useLazySearchGenesQuery = vi.fn();
const useLazySearchTranscriptsQuery = vi.fn();
const useLazySearchVariantsQuery = vi.fn();
let mockCommittedSpecies: CommittedItem[] = [];
let mockHasLoadedStoredSpecies = true;

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
  useLocation: () => ({ state: mockLocationState }),
  Link: (props: any) => <a href={props.to}>{props.children}</a>
}));

vi.mock('src/store', () => ({
  useAppSelector: (selector: unknown) => {
    if (selector === getCommittedSpecies) {
      return mockCommittedSpecies;
    }

    if (selector === getHasLoadedStoredSpecies) {
      return mockHasLoadedStoredSpecies;
    }

    return mockUseAppSelector(selector);
  }
}));

vi.mock('src/shared/state/api-slices/searchApiSlice', () => ({
  useLazySearchGenesQuery: () => useLazySearchGenesQuery(),
  useLazySearchTranscriptsQuery: () => useLazySearchTranscriptsQuery(),
  useLazySearchVariantsQuery: () => useLazySearchVariantsQuery()
}));

const committedSpecies: CommittedItem[] = [createSelectedSpecies()];

const geneResults: SearchResults = {
  meta: {
    page: 1,
    per_page: 50,
    total_hits: 1
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

const renderComponent = () => render(<SearchResultsView />);

describe('<SearchResultsView />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
    mockSetSearchParams.mockReset();
    mockSearchParams.delete('query');
    mockSearchParams.set('query', '');
    mockLocationState = null;
    mockCommittedSpecies = committedSpecies;
    mockHasLoadedStoredSpecies = true;
  });

  it('redirects back to search when query is missing', async () => {
    useLazySearchGenesQuery.mockReturnValue([vi.fn(), {}]);
    useLazySearchTranscriptsQuery.mockReturnValue([vi.fn(), {}]);
    useLazySearchVariantsQuery.mockReturnValue([vi.fn(), {}]);

    renderComponent();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/search', { replace: true });
    });
  });

  it('redirects back to search when there are no committed species', async () => {
    const triggerGeneSearch = vi.fn();
    const triggerTranscriptSearch = vi.fn();
    const triggerVariantSearch = vi.fn();

    mockCommittedSpecies = [];
    mockHasLoadedStoredSpecies = true;
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

    mockSearchParams.set('query', 'brca2');
    renderComponent();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/search', { replace: true });
    });

    expect(triggerGeneSearch).not.toHaveBeenCalled();
    expect(triggerTranscriptSearch).not.toHaveBeenCalled();
    expect(triggerVariantSearch).not.toHaveBeenCalled();
  });

  it('does not redirect before stored species have loaded', () => {
    mockCommittedSpecies = [];
    mockHasLoadedStoredSpecies = false;
    useLazySearchGenesQuery.mockReturnValue([
      vi.fn(),
      {
        reset: vi.fn()
      }
    ]);
    useLazySearchTranscriptsQuery.mockReturnValue([
      vi.fn(),
      {
        reset: vi.fn()
      }
    ]);
    useLazySearchVariantsQuery.mockReturnValue([
      vi.fn(),
      {
        reset: vi.fn()
      }
    ]);

    mockSearchParams.set('query', 'brca2');
    renderComponent();

    expect(mockNavigate).not.toHaveBeenCalledWith('/search', {
      replace: true
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

    mockSearchParams.set('query', 'TP53');
    renderComponent();

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
    expect(screen.queryByText('Search results for "TP53"')).toBeNull();
  });

  it('shows one loading spinner instead of result sections while searches are fetching', () => {
    mockSearchParams.set('query', 'TP53');

    useLazySearchGenesQuery.mockReturnValue([
      vi.fn(),
      {
        currentData: geneResults,
        reset: vi.fn(),
        isFetching: false
      }
    ]);
    useLazySearchTranscriptsQuery.mockReturnValue([
      vi.fn(),
      {
        currentData: emptyResults,
        reset: vi.fn(),
        isFetching: true
      }
    ]);
    useLazySearchVariantsQuery.mockReturnValue([
      vi.fn(),
      {
        currentData: emptyResults,
        reset: vi.fn(),
        isFetching: false
      }
    ]);

    renderComponent();

    expect(
      screen.getByRole('status', {
        name: 'Searching features'
      })
    ).toBeTruthy();
    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(screen.queryByText('Gene search results')).toBeNull();
    expect(screen.queryByText('Transcript search results')).toBeNull();
    expect(screen.queryByText('Variant search results')).toBeNull();
  });

  it('returns to the originating page when the close button is clicked', async () => {
    mockLocationState = { returnTo: '/species-selector' };
    mockSearchParams.set('query', 'TP53');

    useLazySearchGenesQuery.mockReturnValue([
      vi.fn(),
      {
        currentData: geneResults,
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
        currentData: emptyResults,
        reset: vi.fn(),
        isFetching: false
      }
    ]);

    renderComponent();

    await userEvent.click(
      screen.getByRole('button', {
        name: 'Close'
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith('/species-selector');
  });
});
