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
import type { Variant } from 'src/shared/types/variation-api/variant';

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
      }),
      transformResponse: async (data: VariantQueryResult, _, params) => {
        // This is a temporary method
        // to add the missing data to the response while the api is not providing it.
        const { variantId } = params;
        const knownVariantIds = ['rs699', 'rs71197234', 'rs202155613'];

        const foundVariantId = knownVariantIds.find((id) =>
          variantId.includes(id)
        );

        if (foundVariantId) {
          const variantDataModule = await import(
            `tests/fixtures/variation/${foundVariantId}`
          );
          const importedVariantData = variantDataModule.default as Variant;

          data.variant.prediction_results =
            importedVariantData.prediction_results;
          data.variant.alleles.forEach((allele, index) => {
            const importedVariantAllele = importedVariantData.alleles[index];
            allele.phenotype_assertions =
              importedVariantAllele.phenotype_assertions ?? [];
            allele.population_frequencies =
              importedVariantAllele.population_frequencies ?? [];
            allele.prediction_results =
              importedVariantAllele.prediction_results ?? [];
          });
        } else {
          data.variant.prediction_results = [];

          data.variant.alleles.forEach((allele) => {
            allele.phenotype_assertions = [];
            allele.population_frequencies = [];
            allele.prediction_results = [];
          });
        }

        data.variant.alternative_names = []; // TODO Agree with the Variation team what the value of alternative names should be if none exist

        return data;
      }
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
          track_list: category.track_list
            .filter(
              (track) =>
                !track.trigger.some((str) =>
                  [
                    'variant-gnomad-genomes',
                    'variant-gnomad-exomes',
                    'variant-clinvar',
                    'variant-gwas'
                  ].includes(str)
                )
            ) // FIXME: remove
            .map((track) => ({
              ...track,
              track_id: (track.track_id = track.trigger.at(-1) as string)
            }))
        }));
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
