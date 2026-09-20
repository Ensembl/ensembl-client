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

import { geneQuery, SequenceViewerGeneQueryResult } from './queries/geneQuery';

type GeneQueryParams = { genomeId: string; geneId: string };
// type TranscriptQueryParams = { genomeId: string; transcriptId: string };

const sequenceViewerThoasSlice = graphqlApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sequenceViewerGene: builder.query<
      SequenceViewerGeneQueryResult,
      GeneQueryParams
    >({
      query: (params) => ({
        url: config.coreApiUrl,
        body: geneQuery,
        variables: params
      })
    })
  })
});

export const { useSequenceViewerGeneQuery } = sequenceViewerThoasSlice;

export const { sequenceViewerGene: fetchSequenceViewerGene } =
  sequenceViewerThoasSlice.endpoints;
