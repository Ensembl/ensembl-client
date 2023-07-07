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

import restApiSlice from 'src/shared/state/api-slices/restSlice';

import type { PopularSpecies } from 'src/content/app/new-species-selector/types/popularSpecies';
import type { SpeciesSearchMatch } from 'src/content/app/new-species-selector/types/speciesSearchMatch';

export type PopularSpeciesRequestParams = {
  selected_genome_ids?: string[]; // <-- // so that the backend can tell us whether popular species contain the genomes that user has selected
};

export type PopularSpeciesResponse = {
  popular_species: PopularSpecies[];
};

export type SpeciesSearchRequestParams = {
  query: string;
};

export type SpeciesSearchResponse = {
  matches: SpeciesSearchMatch[];
  meta: {
    total_count: number;
  };
};

const speciesSelectorApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPopularSpecies: builder.query<
      PopularSpeciesResponse,
      PopularSpeciesRequestParams
    >({
      queryFn: async () => {
        // TODO: change this function when BE exposes an endpoint
        const { popularSpecies: popularSpeciesSampleData } = await import(
          './speciesSelectorSampleData'
        );
        return { data: { popular_species: popularSpeciesSampleData } };
      }
    }),
    getSpeciesSearchResults: builder.query<
      SpeciesSearchResponse,
      SpeciesSearchRequestParams
    >({
      queryFn: async () => {
        // TODO: change this function when BE exposes an endpoint
        const { humanSearchMatches } = await import(
          './speciesSelectorSampleData'
        );

        return {
          data: {
            matches: humanSearchMatches,
            meta: { total_count: humanSearchMatches.length }
          }
        };
      }
    })
  })
});

export const {
  useGetPopularSpeciesQuery,
  useLazyGetSpeciesSearchResultsQuery
} = speciesSelectorApiSlice;
