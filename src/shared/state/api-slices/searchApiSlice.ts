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

import restApiSlice from 'src/shared/state/api-slices/restSlice';

import type { SearchResults } from 'src/shared/types/search-api/search-results';

type SearchParams = {
  genome_ids: string[];
  query: string;
  page: number;
  per_page: number;
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
          url: 'http://localhost:8083/api/search/variants',
          method: 'POST',
          body: params
        };
      }
    })
  })
});

export const { useLazySearchGenesQuery, useLazySearchVariantsQuery } =
  searchApiSlice;
