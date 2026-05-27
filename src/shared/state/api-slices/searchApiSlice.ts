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

import graphqlApiSlice from 'src/shared/state/api-slices/graphqlApiSlice';
import restApiSlice from 'src/shared/state/api-slices/restSlice';

import type { SearchResults } from 'src/shared/types/search-api/search-results';

type SearchParams = {
  genome_ids: string[];
  query: string;
  page: number;
  per_page: number;
};

type TranscriptSearchQueryResponse = {
  transcript_search: {
    meta: SearchResults['meta'];
    matches: TranscriptSearchMatchResponse[];
  };
};

type TranscriptSearchMatchResponse = {
  stable_id: string;
  unversioned_stable_id: string;
  symbol: string | null;
  genome_id: string;
};

const transcriptSearchQuery = gql`
  query TranscriptSearch(
    $query: String!
    $genome_ids: [String!]!
    $page: Int!
    $per_page: Int!
  ) {
    transcript_search(
      search_payload: {
        query: $query
        genome_ids: $genome_ids
        page: $page
        per_page: $per_page
      }
    ) {
      meta {
        total_hits
        page
        per_page
      }
      matches {
        stable_id
        unversioned_stable_id
        symbol
        genome_id
      }
    }
  }
`;

const parseTranscriptSearchResults = (
  response: TranscriptSearchQueryResponse
): SearchResults => {
  const transcriptSearch = response.transcript_search;

  const matches = transcriptSearch.matches.map((match) => ({
    type: 'Transcript' as const,
    stable_id: match.stable_id,
    unversioned_stable_id: match.unversioned_stable_id,
    symbol: match.symbol,
    genome_id: match.genome_id
  }));

  return {
    meta: transcriptSearch.meta,
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

const graphqlSearchApiSlice = graphqlApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    searchTranscripts: builder.query<SearchResults, SearchParams>({
      query: (params) => ({
        url: config.coreApiUrl,
        body: transcriptSearchQuery,
        variables: params
      }),
      transformResponse(response: TranscriptSearchQueryResponse) {
        return parseTranscriptSearchResults(response);
      }
    })
  })
});

export const { useLazySearchGenesQuery, useLazySearchVariantsQuery } =
  searchApiSlice;
export const { useLazySearchTranscriptsQuery } = graphqlSearchApiSlice;
