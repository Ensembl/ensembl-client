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

type GeneQueryParams = { genomeId: string; geneId: string };
type ProductQueryParams = { productId: string; genomeId: string };
type VariantQueryParams = { genomeId: string; variantId: string };

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
      })
    })
  })
});

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
  useDefaultEntityViewerVariantQuery
} = entityViewerThoasSlice;

export const {
  genePageMeta: fetchGenePageMeta,
  variantPageMeta: fetchVariantPageMeta
} = entityViewerThoasSlice.endpoints;
