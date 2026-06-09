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

export type GenomeGroup = {
  group_id: number;
  title: string;
  description: string | null;
  rank: number;
  genomes_count: number;
};

export type GenomeGroupCategory = {
  display_name: string;
  type: string;
  groups: GenomeGroup[];
};

export type GenomeGroupCategoriesResponse = {
  group_categories: GenomeGroupCategory[];
};

export type SpeciesSearchRequestParams = {
  query: string;
  page: number;
  perPage?: number;
  sortBy?: string | null;
  sortOrder?: string | null;
};

export type SpeciesSearchResponse = {
  matches: SpeciesSearchMatch[];
  meta: {
    total_hits: number;
  };
};

export type GenomesSearchBySpeciesTaxonomyIdRequestParams = {
  speciesTaxonomyId: string | number;
  page: number;
  perPage?: number;
  sortBy?: string | null;
  sortOrder?: string | null;
};

export type GenomesSearchByGenomeGroupIdRequestParams = {
  genomeGroupId: string | number;
  page: number;
  perPage?: number;
  sortBy?: string | null;
  sortOrder?: string | null;
};

const speciesSelectorApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPopularSpecies: builder.query<PopularSpeciesResponse, void>({
      query: () => ({
        url: `${config.metadataApiBaseUrl}/popular_species`
      })
    }),
    getGenomeGroupCategories: builder.query<
      GenomeGroupCategoriesResponse,
      void
    >({
      query: () => ({
        url: `${config.metadataApiBaseUrl}/genome_group_categories`
      })
    }),
    getSpeciesSearchResults: builder.query<
      SpeciesSearchResponse,
      SpeciesSearchRequestParams
    >({
      query: (params) => ({
        url: `${config.searchApiBaseUrl}/genomes/v2?${prepareGenomeSearchParams(params)}`
      })
    }),
    getGenomesBySpeciesTaxonomyId: builder.query<
      SpeciesSearchResponse,
      GenomesSearchBySpeciesTaxonomyIdRequestParams
    >({
      query: (params) => ({
        url: `${config.searchApiBaseUrl}/genomes/v2?${prepareGenomeSearchParams(params)}`
      })
    }),
    getGenomesByGenomeGroupId: builder.query<
      SpeciesSearchResponse,
      GenomesSearchByGenomeGroupIdRequestParams
    >({
      query: (params) => ({
        url: `${config.searchApiBaseUrl}/genomes/v2?${prepareGenomeSearchParams(params)}`
      })
    })
  })
});

const prepareGenomeSearchParams = (
  params:
    | SpeciesSearchRequestParams
    | GenomesSearchBySpeciesTaxonomyIdRequestParams
    | GenomesSearchByGenomeGroupIdRequestParams
) => {
  const searchParams = new URLSearchParams();
  if ('query' in params) {
    searchParams.set('query', params.query);
  } else if ('speciesTaxonomyId' in params) {
    searchParams.set('species_taxonomy_id', `${params.speciesTaxonomyId}`);
  } else if ('genomeGroupId' in params) {
    searchParams.set('genome_group_id', `${params.genomeGroupId}`);
  }
  searchParams.set('page', `${params.page}`);

  const perPage = params.perPage ?? '100';
  searchParams.set('per_page', `${perPage}`);

  if (params.sortBy) {
    const sortOrder = params.sortOrder ?? 'asc';
    searchParams.set('sort', params.sortBy);
    searchParams.set('order', sortOrder);
  }

  return searchParams.toString();
};

export const getSpeciesSearchLastPageNumber = ({
  data,
  perPage
}: {
  data: SpeciesSearchResponse;
  perPage: number;
}) => {
  return Math.ceil(data.meta.total_hits / perPage);
};

export const useGenomesQuery =
  speciesSelectorApiSlice.useGetSpeciesSearchResultsQuery;
export const useLazyGenomesQuery =
  speciesSelectorApiSlice.useLazyGetSpeciesSearchResultsQuery;
export const useGenomesBySpeciesTaxonomyIdQuery =
  speciesSelectorApiSlice.useGetGenomesBySpeciesTaxonomyIdQuery;
export const useGenomesByGenomeGroupIdQuery =
  speciesSelectorApiSlice.useGetGenomesByGenomeGroupIdQuery;
export const usePopularSpeciesQuery =
  speciesSelectorApiSlice.useGetPopularSpeciesQuery;
export const useGenomeGroupCategoriesQuery =
  speciesSelectorApiSlice.useGetGenomeGroupCategoriesQuery;
