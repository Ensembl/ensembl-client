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
import thoasApiSlice from 'src/shared/state/api-slices/thoasSlice';

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
import { regionQuery, type RegionQueryResult } from './queries/regionQuery';

import type { GenomeTrackCategory } from 'src/content/app/genome-browser/state/types/tracks';
import type { TrackPanelGene } from '../types/track-panel-gene';

type GeneQueryParams = { genomeId: string; geneId: string };
type TranscriptQueryParams = { genomeId: string; transcriptId: string };
type RegionQueryParams = { genomeId: string; regionName: string };

const genomeBrowserApiSlice = thoasApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTrackPanelGene: builder.query<{ gene: TrackPanelGene }, GeneQueryParams>(
      {
        query: (params) => ({
          body: trackPanelGeneQuery(params)
        })
      }
    ),
    gbGeneSummary: builder.query<GeneSummaryQueryResult, GeneQueryParams>({
      query: (params) => ({
        body: geneSummaryQuery,
        variables: params
      })
    }),
    gbTranscriptSummary: builder.query<
      TranscriptSummaryQueryResult,
      TranscriptQueryParams
    >({
      query: (params) => ({
        body: transcriptSummaryQuery,
        variables: params
      })
    }),
    gbTranscriptInZmenu: builder.query<
      TranscriptZmenuQueryResult,
      TranscriptQueryParams
    >({
      query: (params) => ({
        body: transcriptZmenuQuery,
        variables: params
      })
    }),
    gbRegion: builder.query<RegionQueryResult, RegionQueryParams>({
      query: (params) => ({
        body: regionQuery,
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
        return response.track_categories;
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
  useGbRegionQuery
} = genomeBrowserApiSlice;

export const { useGenomeTracksQuery } = genomeBrowserRestApiSlice;
