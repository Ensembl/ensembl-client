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

import graphqlApiSlice from 'src/shared/state/api-slices/graphqlApiSlice';

import config from 'config';

import {
  genePageMetaQuery,
  type GenePageMetaQueryResult,
  type GenePageMeta
} from './queries/genePageMetaQuery';
import {
  defaultGeneQuery,
  type DefaultEntityViewerGeneQueryResult
} from './queries/defaultGeneQuery';
import {
  geneSummaryQuery,
  type GeneSummaryQueryResult
} from './queries/geneSummaryQuery';
import {
  geneExternalReferencesQuery,
  type GeneExternalReferencesQueryResult
} from './queries/geneExternalReferencesQuery';
import {
  geneOverviewQuery,
  type GeneOverviewQueryResult
} from './queries/geneOverviewQuery';
import {
  geneForSequenceDownloadQuery,
  type GeneForSequenceDownloadQueryResult
} from './queries/geneForSequenceDownloadQuery';
import {
  proteinDomainsQuery,
  type ProteinDomainsQueryResult
} from './queries/proteinDomainsQuery';
import {
  geneHomologiesQuery,
  type EntityViewerGeneHomologiesQueryResult
} from './queries/geneHomologiesQuery';
import {
  variantPageMetaQuery,
  type VariantPageMetaQueryResult,
  type VariantPageMeta
} from './queries/variantPageMetaQuery';
import {
  variantDefaultQuery,
  type EntityViewerVariantDefaultQueryResult
} from './queries/variantDefaultQuery';
import {
  variantStudyPopulationsQuery,
  type VariantStudyPopulationsQueryResult
} from './queries/variantStudyPopulationsQuery';
import {
  variantAlleleFrequenciesQuery,
  type VariantAlleleFrequenciesQueryResult
} from './queries/variantAlleleFrequenciesQuery';
import {
  variantPredictedMolecularConsequencesQuery,
  type VariantPredictedMolecularConsequencesResponse
} from './queries/variantPredictedMolecularConsequencesQuery';
import {
  geneForVariantTranscriptConsequencesQuery,
  transcriptForVariantTranscriptConsequencesQuery,
  type GeneForVariantTranscriptConsequencesResponse,
  type TranscriptForVariantTranscriptConsequencesResponse
} from './queries/variantTranscriptConsequencesQueries';

type GeneQueryParams = { genomeId: string; geneId: string };
type TranscriptQueryParams = { genomeId: string; transcriptId: string };
type ProductQueryParams = { productId: string; genomeId: string };
type VariantQueryParams = { genomeId: string; variantId: string };
type VariantStudyPopulationsQueryParams = { genomeId: string };

const entityViewerThoasSlice = graphqlApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    genePageMeta: builder.query<GenePageMeta, GeneQueryParams>({
      query: (params) => ({
        url: config.coreApiUrl,
        body: genePageMetaQuery,
        variables: params
      }),
      transformResponse(response: GenePageMetaQueryResult) {
        const {
          gene: { stable_id, symbol }
        } = response;

        const title = `Gene: ${symbol ?? stable_id} — Ensembl`;

        return {
          title
        };
      }
    }),
    defaultEntityViewerGene: builder.query<
      DefaultEntityViewerGeneQueryResult,
      GeneQueryParams
    >({
      query: (params) => ({
        url: config.coreApiUrl,
        body: defaultGeneQuery,
        variables: params
      })
    }),
    geneSummary: builder.query<GeneSummaryQueryResult, GeneQueryParams>({
      query: (params) => ({
        url: config.coreApiUrl,
        body: geneSummaryQuery,
        variables: params
      })
    }),
    geneOverview: builder.query<GeneOverviewQueryResult, GeneQueryParams>({
      query: (params) => ({
        url: config.coreApiUrl,
        body: geneOverviewQuery,
        variables: params
      })
    }),
    geneExternalReferences: builder.query<
      GeneExternalReferencesQueryResult,
      GeneQueryParams
    >({
      query: (params) => ({
        url: config.coreApiUrl,
        body: geneExternalReferencesQuery,
        variables: params
      })
    }),
    geneForSequenceDownload: builder.query<
      GeneForSequenceDownloadQueryResult,
      GeneQueryParams
    >({
      query: (params) => ({
        url: config.coreApiUrl,
        body: geneForSequenceDownloadQuery,
        variables: params
      })
    }),
    proteinDomains: builder.query<
      ProteinDomainsQueryResult,
      ProductQueryParams
    >({
      query: (params) => ({
        url: config.coreApiUrl,
        body: proteinDomainsQuery,
        variables: params
      })
    }),
    evGeneHomology: builder.query<
      EntityViewerGeneHomologiesQueryResult,
      GeneQueryParams
    >({
      query: (params) => ({
        url: config.comparaApiBaseUrl,
        body: geneHomologiesQuery,
        variables: params
      })
    }),
    variantPageMeta: builder.query<VariantPageMeta, VariantQueryParams>({
      query: (params) => ({
        url: config.variationApiUrl,
        body: variantPageMetaQuery,
        variables: params
      }),
      transformResponse(response: VariantPageMetaQueryResult) {
        const {
          variant: { name: variantName }
        } = response;

        const title = `Variant: ${variantName} — Ensembl`;

        return {
          title
        };
      }
    }),
    defaultEntityViewerVariant: builder.query<
      EntityViewerVariantDefaultQueryResult,
      VariantQueryParams
    >({
      query: (params) => ({
        url: config.variationApiUrl,
        body: variantDefaultQuery,
        variables: params
      }),
      transformResponse: (response: EntityViewerVariantDefaultQueryResult) => {
        return addAlleleUrlId(response);
      }
    }),
    variantStudyPopulations: builder.query<
      VariantStudyPopulationsQueryResult,
      VariantStudyPopulationsQueryParams
    >({
      query: (params) => ({
        url: config.variationApiUrl,
        body: variantStudyPopulationsQuery,
        variables: params
      })
    }),
    variantAllelePopulationFrequencies: builder.query<
      VariantAlleleFrequenciesQueryResult,
      VariantQueryParams
    >({
      query: (params) => ({
        url: config.variationApiUrl,
        body: variantAlleleFrequenciesQuery,
        variables: params
      }),
      transformResponse: (response: VariantAlleleFrequenciesQueryResult) =>
        addAlleleUrlId(response)
    }),
    variantPredictedMolecularConsequences: builder.query<
      VariantPredictedMolecularConsequencesResponse,
      VariantQueryParams
    >({
      query: (params) => ({
        url: config.variationApiUrl,
        body: variantPredictedMolecularConsequencesQuery,
        variables: params
      }),
      transformResponse: (response: VariantPredictedMolecularConsequencesResponse) => {
        // Adapt to the api error by copying values from consequence.accession_id to consequence.value
        // TODO: remove when the api is fix
        for (const allele of response.variant.alleles ) {
          for ( const predicted_consequence of allele.predicted_molecular_consequences ) {
            for ( const cons of predicted_consequence.consequences) {
              cons.value = (cons as any).accession_id;
            }
          }

        }
        return addAlleleUrlId(response);
      }

    }),
    geneForVariantTranscriptConsequences: builder.query<
      GeneForVariantTranscriptConsequencesResponse,
      TranscriptQueryParams
    >({
      query: (params) => ({
        url: config.coreApiUrl,
        body: geneForVariantTranscriptConsequencesQuery,
        variables: params
      })
    }),
    transcriptForVariantTranscriptConsequences: builder.query<
      TranscriptForVariantTranscriptConsequencesResponse,
      TranscriptQueryParams
    >({
      query: (params) => ({
        url: config.coreApiUrl,
        body: transcriptForVariantTranscriptConsequencesQuery,
        variables: params
      })
    }),
  })
});

const addAlleleUrlId = <
  T extends {
    variant: {
      alleles: Record<string, unknown>[];
    };
  }
>(
  response: T
): T => {
  response.variant.alleles = response.variant.alleles.map((allele, index) => ({
    ...allele,
    urlId: `${index}`
  }));

  return response;
};

export const {
  useGenePageMetaQuery,
  useDefaultEntityViewerGeneQuery,
  useGeneSummaryQuery,
  useGeneOverviewQuery,
  useGeneExternalReferencesQuery,
  useGeneForSequenceDownloadQuery,
  useProteinDomainsQuery,
  useEvGeneHomologyQuery,
  useVariantPageMetaQuery,
  useDefaultEntityViewerVariantQuery,
  useVariantStudyPopulationsQuery,
  useVariantAllelePopulationFrequenciesQuery,
  useVariantPredictedMolecularConsequencesQuery,
  useGeneForVariantTranscriptConsequencesQuery,
  useTranscriptForVariantTranscriptConsequencesQuery
} = entityViewerThoasSlice;

export const {
  genePageMeta: fetchGenePageMeta,
  variantPageMeta: fetchVariantPageMeta,
  defaultEntityViewerVariant: fetchDefaultEntityViewerVariant
} = entityViewerThoasSlice.endpoints;
