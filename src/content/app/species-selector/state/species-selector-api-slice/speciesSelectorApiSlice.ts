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

import config from 'config';

import type { PopularSpecies } from 'src/content/app/species-selector/types/popularSpecies';
import type { SpeciesSearchMatch } from 'src/content/app/species-selector/types/speciesSearchMatch';

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

export type GenomesSearchBySpeciesTaxonomyIdRequestParams = {
  speciesTaxonomyId: string | number;
};

const speciesSelectorApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPopularSpecies: builder.query<PopularSpeciesResponse, void>({
      query: () => ({
        url: `${config.metadataApiBaseUrl}/popular_species`
      })
    }),
    getSpeciesSearchResults: builder.query<
      SpeciesSearchResponse,
      SpeciesSearchRequestParams
    >({
      query: ({ query }) => ({
        url: `${config.searchApiBaseUrl}/genomes?query=${query}`
      })
    }),
    getGenomesBySpeciesTaxonomyId: builder.query<
      SpeciesSearchResponse,
      GenomesSearchBySpeciesTaxonomyIdRequestParams
    >({
      query: ({ speciesTaxonomyId }) => ({
        url: `${config.searchApiBaseUrl}/genomes?species_taxonomy_id=${speciesTaxonomyId}`
      })
    })
  })
});

export const {
  useGetPopularSpeciesQuery,
  useLazyGetSpeciesSearchResultsQuery,
  useLazyGetGenomesBySpeciesTaxonomyIdQuery
} = speciesSelectorApiSlice;
