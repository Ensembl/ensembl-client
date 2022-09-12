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

import thoasApiSlice from 'src/shared/state/api-slices/thoasSlice';

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
  GeneExternalReferencesQueryResult
} from './queries/geneExternalReferencesQuery';
import {
  geneOverviewQuery,
  GeneOverviewQueryResult
} from './queries/geneOverviewQuery';
import {
  geneForSequenceDownloadQuery,
  GeneForSequenceDownloadQueryResult
} from './queries/geneForSequenceDownloadQuery';
import {
  proteinDomainsQuery,
  ProteinDomainsQueryResult
} from './queries/proteinDomainsQuery';

type GeneQueryParams = { genomeId: string; geneId: string };
type ProductQueryParams = { productId: string; genomeId: string };

const entityViewerThoasSlice = thoasApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    genePageMeta: builder.query<GenePageMeta, GeneQueryParams>({
      query: (params) => ({
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
        body: defaultGeneQuery,
        variables: params
      })
    }),
    geneSummary: builder.query<GeneSummaryQueryResult, GeneQueryParams>({
      query: (params) => ({
        body: geneSummaryQuery,
        variables: params
      })
    }),
    geneOverview: builder.query<GeneOverviewQueryResult, GeneQueryParams>({
      query: (params) => ({
        body: geneOverviewQuery,
        variables: params
      })
    }),
    geneExternalReferences: builder.query<
      GeneExternalReferencesQueryResult,
      GeneQueryParams
    >({
      query: (params) => ({
        body: geneExternalReferencesQuery,
        variables: params
      })
    }),
    geneForSequenceDownload: builder.query<
      GeneForSequenceDownloadQueryResult,
      GeneQueryParams
    >({
      query: (params) => ({
        body: geneForSequenceDownloadQuery,
        variables: params
      })
    }),
    proteinDomains: builder.query<
      ProteinDomainsQueryResult,
      ProductQueryParams
    >({
      query: (params) => ({
        body: proteinDomainsQuery,
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
  useProteinDomainsQuery
} = entityViewerThoasSlice;

export const { genePageMeta: fetchGenePageMeta } =
  entityViewerThoasSlice.endpoints;
