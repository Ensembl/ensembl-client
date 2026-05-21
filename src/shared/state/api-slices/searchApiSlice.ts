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

import config from 'config';
import { gql } from 'graphql-request';

import restApiSlice from 'src/shared/state/api-slices/restSlice';
import graphqlApiSlice from 'src/shared/state/api-slices/graphqlApiSlice';

import type { SearchResults } from 'src/shared/types/search-api/search-results';

type SearchParams = {
  genome_ids: string[];
  query: string;
  page: number;
  per_page: number;
};

type TranscriptSearchQueryResponse = {
  transcript_search?: {
    meta?: SearchResults['meta'];
    matches?: TranscriptSearchMatchResponse[];
  };
};

type TranscriptSearchMatchResponse = {
  stable_id?: string | null;
  symbol?: string | null;
  genome_id?: string | null;
};

const transcriptSearchQuery = gql`
  query TranscriptSearch(
    $query: String!
    $genomeIds: [String!]!
    $page: Int!
    $perPage: Int!
  ) {
    transcript_search(
      search_payload: {
        query: $query
        genome_ids: $genomeIds
        page: $page
        per_page: $perPage
      }
    ) {
      meta {
        total_hits
        page
        per_page
      }
      matches {
        stable_id
        symbol
        genome_id
      }
    }
  }
`;

const buildEmptySearchResults = (params: SearchParams): SearchResults => ({
  meta: {
    total_hits: 0,
    page: params.page,
    per_page: params.per_page
  },
  matches: []
});

const getUnversionedStableId = (stableId: string) => {
  return stableId.split('.')[0];
};

const normalizeTranscriptSearchResults = (
  response: TranscriptSearchQueryResponse,
  params: SearchParams
): SearchResults => {
  const transcriptSearch = response.transcript_search;

  if (!transcriptSearch) {
    return buildEmptySearchResults(params);
  }

  const matches = (transcriptSearch.matches ?? []).flatMap((match) => {
    const { stable_id: stableId } = match;
    const genomeId =
      match.genome_id ??
      (params.genome_ids.length === 1 ? params.genome_ids[0] : undefined);

    if (!stableId || !genomeId) {
      return [];
    }

    return [
      {
        type: 'Transcript' as const,
        stable_id: stableId,
        unversioned_stable_id: getUnversionedStableId(stableId),
        symbol: match.symbol ?? null,
        genome_id: genomeId
      }
    ];
  });

  return {
    meta: transcriptSearch.meta ?? {
      total_hits: matches.length,
      page: params.page,
      per_page: params.per_page
    },
    matches
  };
};

const searchApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchGenes: builder.query<SearchResults, SearchParams>({
      query: (params) => {
        return {
          url: `${config.searchApiBaseUrl}/genes`,
          method: 'POST',
          body: params
        };
      }
    }),
    searchVariants: builder.query<SearchResults, SearchParams>({
      query: (params) => {
        return {
          url: `${config.searchApiBaseUrl}/variants`,
          method: 'POST',
          body: params
        };
      }
    })
  })
});

const transcriptSearchApiSlice = graphqlApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchTranscripts: builder.query<SearchResults, SearchParams>({
      queryFn: async (params, _queryApi, _extraOptions, baseQuery) => {
        const query = params.query.trim();

        if (!params.genome_ids.length || !query) {
          return { data: buildEmptySearchResults(params) };
        }

        const { data, error } = await baseQuery({
          url: config.coreApiUrl,
          body: transcriptSearchQuery,
          variables: {
            query,
            genomeIds: params.genome_ids,
            page: params.page,
            perPage: params.per_page
          }
        });

        if (error) {
          return { error };
        }

        return {
          data: normalizeTranscriptSearchResults(
            data as TranscriptSearchQueryResponse,
            params
          )
        };
      }
    })
  })
});

export const { useLazySearchGenesQuery, useLazySearchVariantsQuery } =
  searchApiSlice;
export const { useLazySearchTranscriptsQuery } = transcriptSearchApiSlice;
