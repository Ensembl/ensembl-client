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

import type {
  SpeciesStatistics,
  SpeciesFileLinksResponse
} from './speciesApiTypes';
import type { GenomeInfo } from 'src/shared/state/genome/genomeTypes';

type SpeciesStatsQueryParams = {
  genomeId: string;
};

type SpeciesStatsResponse = {
  genome_stats: SpeciesStatistics;
};

const speciesApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSpeciesStatistics: builder.query<
      SpeciesStatsResponse,
      SpeciesStatsQueryParams
    >({
      query: (params) => ({
        url: `${config.metadataApiBaseUrl}/genome/${params.genomeId}/stats`
      })
    }),
    speciesDetails: builder.query<GenomeInfo, string>({
      query: (genomeId) => ({
        url: `${config.metadataApiBaseUrl}/genome/${genomeId}/details`
      })
    }),
    speciesFileLinks: builder.query<SpeciesFileLinksResponse, string>({
      /*query: (genomeId) => ({
        url: `${config.metadataApiBaseUrl}/genome/${genomeId}/details`
      })*/
      queryFn: async (genomeId) => {
        //eslint-disable-line
        const { mockFtpLinks } = await import('./fixtures/mockFtpLinks');
        return { data: mockFtpLinks };
      }
    })
  })
});

export const {
  useGetSpeciesStatisticsQuery,
  useSpeciesDetailsQuery,
  useSpeciesFileLinksQuery
} = speciesApiSlice;
