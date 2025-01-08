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

import type { OverviewRegion } from 'src/content/app/regulatory-activity-viewer/types/regionOverview';
import type { Epigenome } from 'src/content/app/regulatory-activity-viewer/types/epigenome';
import type { EpigenomeMetadataDimensionsResponse } from 'src/content/app/regulatory-activity-viewer/types/epigenomeMetadataDimensions';
import type { EpigenomeActivityResponse } from 'src/content/app/regulatory-activity-viewer/types/epigenomeActivity';

export type Location = {
  regionName: string;
  start: number;
  end: number;
};

type RegionOverviewRequestParams = {
  assemblyName: string; // <-- this will be replaced by assembly accession id
  location: string; // <-- as formatted by the stringifyLocation function
};

export const stringifyLocation = (location: Location) =>
  `${location.regionName}:${location.start}-${location.end}`;

const activityViewerApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // /api/regulation/region-of-interest/v0.1.0/GRCh38?location=17:58190566-58699001
    regionOverview: builder.query<OverviewRegion, RegionOverviewRequestParams>({
      query: (params) => {
        const { assemblyName, location } = params;
        return {
          url: `${config.regulationApiBaseUrl}/region-of-interest/v0.1.0/${assemblyName}?location=${location}`
        };
      }
      // queryFn: async (params) => {
      //   const module = await import(
      //     'tests/fixtures/activity-viewer/mockRegionOverviewDense'
      //   );
      //   const data = module.default;

      //   return { data };
      // }
    }),
    baseEpigenomes: builder.query<Epigenome[], void>({
      queryFn: async () => {
        const module = await import(
          'tests/fixtures/activity-viewer/epigenomes-metadata/mockHumanBaseEpigenomes'
        );
        const data = module.default;

        return { data };
      }
    }),
    epigenomeMetadataDimensions: builder.query<
      EpigenomeMetadataDimensionsResponse,
      void
    >({
      queryFn: async () => {
        const module = await import(
          'tests/fixtures/activity-viewer/epigenomes-metadata/mockHumanEpigenomeMetadataDimensions'
        );
        const data = module.default;

        return { data };
      }
    }),
    epigenomesActivity: builder.query<EpigenomeActivityResponse, void>({
      queryFn: async () => {
        const module = await import(
          'tests/fixtures/activity-viewer/epigenomes-activity/mockEpigenomeActivityResponse.json'
        );
        const data = module.default as EpigenomeActivityResponse;

        return { data };
      }
    })
  })
});

export const {
  useRegionOverviewQuery,
  useEpigenomeMetadataDimensionsQuery,
  useBaseEpigenomesQuery,
  useEpigenomesActivityQuery
} = activityViewerApiSlice;
