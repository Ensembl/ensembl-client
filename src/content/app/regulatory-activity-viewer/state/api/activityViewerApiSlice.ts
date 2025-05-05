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

import type {
  OverviewRegion,
  FocusGene
} from 'src/content/app/regulatory-activity-viewer/types/regionOverview';
import type { Epigenome } from 'src/content/app/regulatory-activity-viewer/types/epigenome';
import type { EpigenomeMetadataDimensionsResponse } from 'src/content/app/regulatory-activity-viewer/types/epigenomeMetadataDimensions';
import type { EpigenomeActivityResponse } from 'src/content/app/regulatory-activity-viewer/types/epigenomeActivity';
import type { GenomicLocation } from 'src/shared/helpers/genomicLocationHelpers';

type RegionOverviewRequestParams = {
  assemblyName: string; // <-- this will be replaced by assembly accession id
  location: string; // <-- as formatted by the stringifyLocation function
};

type FocusGeneParams = {
  assemblyName: string;
  geneId: string; // <-- versioned or unversioned gene stable id
};

type BaseEpigenomesRequestParams = {
  assemblyName: string; // <-- this will be replaced by assembly accession id
};

type EpigenomeMetadataRequestParams = {
  assemblyName: string; // <-- this will be replaced by assembly accession id
};

type EpigenomesActivityRequestParams = {
  assemblyAccessionId: string;
  regionName: string;
  locations: { start: number; end: number }[];
  epigenomeIds: string[];
};

// A mock release string to use in regulation api endpoints.
// Regulation team's apis now require a release string (although as of now, they don't care what that string is).
// TODO: This should be replaced with the release specific for the genome
const releaseName = '2025-02';

export const stringifyLocation = (location: GenomicLocation) =>
  `${location.regionName}:${location.start}-${location.end}`;

const activityViewerApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    regionOverview: builder.query<OverviewRegion, RegionOverviewRequestParams>({
      query: (params) => {
        const { assemblyName, location } = params;
        return {
          url: `${config.regulationApiBaseUrl}/annotation/v0.5/release/${releaseName}/assembly/${assemblyName}?location=${location}`
        };
      }
    }),
    focusGene: builder.query<FocusGene, FocusGeneParams>({
      queryFn: async (params, _, __, baseQuery) => {
        const { assemblyName, geneId } = params;
        try {
          const url = `${config.regulationApiBaseUrl}/annotation/v0.5/release/${releaseName}/assembly/${assemblyName}/gene/${geneId}`;
          const result = await baseQuery(url);
          return {
            data: result.data as FocusGene
          };
        } catch {
          return {
            error: {
              status: 'FETCH_ERROR',
              error: `Failed to fetch gene ${geneId}`
            }
          };
        }
      }
    }),
    baseEpigenomes: builder.query<Epigenome[], BaseEpigenomesRequestParams>({
      query: (params) => ({
        url: `${config.regulationApiBaseUrl}/epigenomes/v0.4/release/${releaseName}/base_epigenomes/assembly/${params.assemblyName}`
      })
    }),
    epigenomeMetadataDimensions: builder.query<
      EpigenomeMetadataDimensionsResponse,
      EpigenomeMetadataRequestParams
    >({
      query: (params) => ({
        url: `${config.regulationApiBaseUrl}/epigenomes/v0.4/release/${releaseName}/metadata_dimensions/assembly/${params.assemblyName}`
      })
    }),
    epigenomesActivity: builder.query<
      EpigenomeActivityResponse,
      EpigenomesActivityRequestParams
    >({
      queryFn: async (params, _, __, baseQuery) => {
        const { assemblyAccessionId, epigenomeIds, locations, regionName } =
          params;
        const url = `${config.regulationApiBaseUrl}/epigenomes/v0.4/release/${releaseName}/region_activity/assembly/${assemblyAccessionId}`;
        const requestBody = {
          region_name: regionName,
          locations,
          epigenome_ids: prepareEpigenomeIdsForRequest(epigenomeIds)
        };

        const { data, error } = await baseQuery({
          url,
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(requestBody)
        });

        if (error) {
          return {
            error
          };
        } else {
          return { data: data as EpigenomeActivityResponse };
        }
      }
    })
  })
});

// Ids that client generates for combined epigenomes are comma-separated strings
// consisting of ids of base epigenomes that comprise the combined epigenome.
// Meanwhile, the api expects arrays of individual epigenome ids.
const prepareEpigenomeIdsForRequest = (epigenomeIds: string[]) =>
  epigenomeIds.map((id) => id.split(', '));

export const {
  useRegionOverviewQuery,
  useFocusGeneQuery,
  useEpigenomeMetadataDimensionsQuery,
  useBaseEpigenomesQuery,
  useEpigenomesActivityQuery
} = activityViewerApiSlice;
