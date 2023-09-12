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
  useGbRegionQuery,
  useGbVariantQuery
} = genomeBrowserApiSlice;

export const { useGenomeTracksQuery } = genomeBrowserRestApiSlice;
