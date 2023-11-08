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

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import config from 'config';
import restApiSlice from 'src/shared/state/api-slices/restSlice';
import graphqlApiSlice from 'src/shared/state/api-slices/graphqlApiSlice';

import trackPanelGeneQuery from './queries/trackPanelGeneQuery';
import {
  geneSummaryQuery,
  type GeneSummaryQueryResult
} from './queries/geneSummaryQuery';
import {
  transcriptSummaryQuery,
  type TranscriptSummaryQueryResult
} from './queries/transcriptSummaryQuery';
import {
  transcriptZmenuQuery,
  type TranscriptZmenuQueryResult
} from './queries/transcriptInZmenuQuery';
import {
  variantDetailsQuery,
  type VariantQueryResult
} from 'src/content/app/genome-browser/state/api/queries/variantQuery';
import { regionQuery, type RegionQueryResult } from './queries/regionQuery';

import {
  RegulationStatistics,
  SpeciesStatsResponse
} from 'src/content/app/species/state/api/speciesApiTypes';

import type { GenomeTrackCategory } from 'src/content/app/genome-browser/state/types/tracks';
import type { TrackPanelGene } from '../types/track-panel-gene';

type GeneQueryParams = { genomeId: string; geneId: string };
type TranscriptQueryParams = { genomeId: string; transcriptId: string };
type RegionQueryParams = { genomeId: string; regionName: string };
type VariantQueryParams = { genomeId: string; variantId: string }; // it isn't quite clear yet what exactly the variant id should be; just an rsID is insufficient

const genomeBrowserApiSlice = graphqlApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTrackPanelGene: builder.query<{ gene: TrackPanelGene }, GeneQueryParams>(
      {
        query: (params) => ({
          url: config.coreApiUrl,
          body: trackPanelGeneQuery(params)
        })
      }
    ),
    gbGeneSummary: builder.query<GeneSummaryQueryResult, GeneQueryParams>({
      query: (params) => ({
        url: config.coreApiUrl,
        body: geneSummaryQuery,
        variables: params
      })
    }),
    gbTranscriptSummary: builder.query<
      TranscriptSummaryQueryResult,
      TranscriptQueryParams
    >({
      query: (params) => ({
        url: config.coreApiUrl,
        body: transcriptSummaryQuery,
        variables: params
      })
    }),
    gbTranscriptInZmenu: builder.query<
      TranscriptZmenuQueryResult,
      TranscriptQueryParams
    >({
      query: (params) => ({
        url: config.coreApiUrl,
        body: transcriptZmenuQuery,
        variables: params
      })
    }),
    gbRegion: builder.query<RegionQueryResult, RegionQueryParams>({
      query: (params) => ({
        url: config.coreApiUrl,
        body: regionQuery,
        variables: params
      })
    }),

    // Maybe move variation endpoints queried from the genome browser into a separate file?
    gbVariant: builder.query<VariantQueryResult, VariantQueryParams>({
      query: (params) => ({
        url: config.variationApiUrl,
        body: variantDetailsQuery,
        variables: params
      })
    })
  })
});

type GenomeTrackCategoriesResponse = {
  track_categories: GenomeTrackCategory[];
};

const genomeBrowserRestApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    genomeTracks: builder.query<GenomeTrackCategory[], string>({
      query: (genomeId) => ({
        url: `${config.tracksApiBaseUrl}/track_categories/${genomeId}`
      }),
      transformResponse: (response: GenomeTrackCategoriesResponse) => {
        /**
         * NOTE: the transformation inside of the map function below is rather disturbing,
         * and should be replaced with something better.
         * It is intended to fix the discrepancy between how the genome browser client identifies a track
         * (it uses the path to the track that triggers the appropriate genome browser program),
         * and how the track api identifies a track.
         *
         * Genome browser will report back to the browser chrome the tracks that it has enabled,
         * using the ids from the track path (i.e. the last string in track trigger arrays).
         * Browser chrome needs to be able to recognize these messages and to respond to them appropriately.
         * For which purpose, we are here redefining track ids as the last string inside of track trigger array.
         */
        return response.track_categories.map((category) => ({
          ...category,
          track_list: category.track_list.map((track) => ({
            ...track,
            track_id: (track.track_id = track.trigger.at(-1) as string)
          }))
        }));
      }
    }),

    getRegulationStats: builder.query<RegulationStatistics, string>({
      queryFn: async (genomeId, queryApi, _, baseQuery) => {
        const statsResponsePromise = baseQuery({
          url: `${config.metadataApiBaseUrl}/genome/${genomeId}/stats`
        });

        const [statsReponse] = await Promise.all([statsResponsePromise]);

        if (statsReponse.data) {
          const statsResponseData = statsReponse.data as SpeciesStatsResponse;
          const genomeStats = statsResponseData.genome_stats;

          return {
            data: genomeStats.regulation_stats
          };
        } else {
          const error = statsReponse.error as FetchBaseQueryError;
          return {
            error
          };
        }
      }
    })
  })
});

export const { getTrackPanelGene, gbRegion: getGBRegion } =
  genomeBrowserApiSlice.endpoints;
export const {
  useGetTrackPanelGeneQuery,
  useGbGeneSummaryQuery,
  useGbTranscriptSummaryQuery,
  useGbTranscriptInZmenuQuery,
  useGbRegionQuery,
  useGbVariantQuery
} = genomeBrowserApiSlice;

export const { useGenomeTracksQuery, useGetRegulationStatsQuery } =
  genomeBrowserRestApiSlice;
