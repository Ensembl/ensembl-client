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
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

import {
  getStatsForSection,
  SpeciesStatsSection,
  speciesStatsSectionNames,
  type StatsSection
} from 'src/content/app/species/state/general/speciesGeneralHelper';

import { getGenomeIdForUrl } from 'src/shared/state/genome/genomeSelectors';

import {
  fetchExampleObjectsForGenome,
  formatGenomeData
} from 'src/shared/state/genome/genomeApiSlice';
import restApiSlice from 'src/shared/state/api-slices/restSlice';

import type { RootState } from 'src/store';
import type { SpeciesStatistics } from './speciesApiTypes';
import type { ExampleFocusObject } from 'src/shared/state/genome/genomeTypes';
import type { GenomeInfo } from 'src/shared/state/genome/genomeTypes';

export type GenomeStats = StatsSection[];

type SpeciesStatsQueryParams = {
  genomeId: string;
};

type SpeciesStatsResponse = {
  genome_stats: SpeciesStatistics;
};

const speciesApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSpeciesStatistics: builder.query<GenomeStats, SpeciesStatsQueryParams>({
      queryFn: async (params, queryApi, _, baseQuery) => {
        const { genomeId } = params;
        const { dispatch } = queryApi;

        const statsResponsePromise = baseQuery({
          url: `${config.metadataApiBaseUrl}/genome/${genomeId}/stats`
        });
        const exampleObjectsResponsePromise = dispatch(
          fetchExampleObjectsForGenome.initiate(genomeId)
        );

        const [statsReponse, exampleObjectsResponse] = await Promise.all([
          statsResponsePromise,
          exampleObjectsResponsePromise
        ]);
        exampleObjectsResponsePromise.unsubscribe();

        if (statsReponse.data && exampleObjectsResponse.data) {
          const statsResponseData = statsReponse.data as SpeciesStatsResponse;
          const exampleFocusObjects =
            exampleObjectsResponse.data as ExampleFocusObject[];

          const state = queryApi.getState() as RootState;
          const genomeIdForUrl = getGenomeIdForUrl(state, genomeId) ?? genomeId;

          const genomeStats = speciesStatsSectionNames
            .map((section) =>
              getStatsForSection({
                allStats: statsResponseData.genome_stats,
                genomeIdForUrl,
                section: section as SpeciesStatsSection,
                exampleFocusObjects
              })
            )
            .filter(Boolean) as GenomeStats;

          return {
            data: genomeStats
          };
        } else {
          const error = (statsReponse.error ||
            exampleObjectsResponse.error) as FetchBaseQueryError;
          return {
            error
          };
        }
      }
    }),
    speciesDetails: builder.query<GenomeInfo, string>({
      query: (genomeId) => ({
        url: `${config.metadataApiBaseUrl}/genome/${genomeId}/details`
      }),
      transformResponse: (response: GenomeInfo) => formatGenomeData(response)
    })
  })
});

export const { useGetSpeciesStatisticsQuery, useSpeciesDetailsQuery } =
  speciesApiSlice;
