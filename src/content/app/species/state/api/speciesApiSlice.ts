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
  type StatsSection
} from 'src/content/app/species/state/general/speciesGeneralHelper';

import {
  getGenomeExampleFocusObjects,
  getGenomeIdForUrl
} from 'src/shared/state/genome/genomeSelectors';

import restApiSlice from 'src/shared/state/api-slices/restSlice';

import type { RootState } from 'src/store';
import type { SpeciesStatistics } from './speciesApiTypes';

export type GenomeStats = StatsSection[];

type SpeciesStatsQueryParams = {
  genomeId: string;
};

type SpeciesStatsResponse = {
  genome_stats: SpeciesStatistics;
};

const helpApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSpeciesStatistics: builder.query<GenomeStats, SpeciesStatsQueryParams>({
      queryFn: async (params, queryApi, _, baseQuery) => {
        const { genomeId } = params;
        const response = await baseQuery({
          url: `${config.metadataApiBaseUrl}/genome/${genomeId}/stats`
        });
        if (response.data) {
          const responseData = response.data as SpeciesStatsResponse;
          const state = queryApi.getState() as RootState;
          const exampleFocusObjects = getGenomeExampleFocusObjects(
            state,
            genomeId
          );
          const genomeIdForUrl = getGenomeIdForUrl(state, genomeId) ?? genomeId;

          const genomeStats = Object.keys(responseData.genome_stats)
            .map((section) =>
              getStatsForSection({
                allStats: responseData.genome_stats,
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
          return {
            error: response.error as FetchBaseQueryError
          };
        }
      }
    })
  })
});

export const { useGetSpeciesStatisticsQuery } = helpApiSlice;
