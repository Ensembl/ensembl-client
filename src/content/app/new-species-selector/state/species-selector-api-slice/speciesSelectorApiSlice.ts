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

type PopularSpeciesRequestParams = {
  selected_genome_ids?: string[]; // <-- // so that the backend can tell us whether popular species contain the genomes that user has selected
};

type PopularSpeciesResponse = {
  popular_species: PopularSpecies[];
};

const speciesSelectorApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPopularSpecies: builder.query<
      PopularSpeciesResponse,
      PopularSpeciesRequestParams
    >({
      queryFn: async () => {
        // <-- TODO: change this function when BE exposes an endpoint
        const { popularSpecies: popularSpeciesSampleData } = await import(
          './speciesSelectorSampleData'
        );
        return { data: { popular_species: popularSpeciesSampleData } };
      }
    })
  })
});

export const { useGetPopularSpeciesQuery } = speciesSelectorApiSlice;
