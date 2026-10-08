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
import restApiSlice from 'src/shared/state/api-slices/restSlice';

import config from 'config';

import {
  geneQuery,
  type SequenceViewerGeneQueryResult
} from './queries/geneQuery';

import type { AnnotatedSequenceOptionsResponsePayload } from 'src/content/app/sequence-viewer/types/annotatedSequenceApi';

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

type GeneSequenceOptionsRequestParams = {
  genomeId: string;
  geneId: string;
};

type TranscriptSequenceOptionsRequestParams = {
  genomeId: string;
  transcriptId: string;
  sequenceType: string;
};

type LocationSequenceOptionsRequestParams = {
  genomeId: string;
  regionName: string;
  start: number;
  end: number;
};

const sequenceViewerRestApiSlice = restApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    geneSequenceOptions: builder.query<
      AnnotatedSequenceOptionsResponsePayload,
      GeneSequenceOptionsRequestParams
    >({
      queryFn: async (params, _queryApi, _extraOptions, baseQuery) => {
        const payload = {
          focus_type: 'gene',
          genome_uuid: params.genomeId,
          stable_id: params.geneId
        };

        const result = await baseQuery({
          url: `${config.annotatedSequenceApi}/sequence-options`,
          method: 'POST',
          body: payload
        });

        if (result.error) {
          return { error: result.error };
        }
        return {
          data: result.data as AnnotatedSequenceOptionsResponsePayload
        };
      }
    }),
    transcriptSequenceOptions: builder.query<
      AnnotatedSequenceOptionsResponsePayload,
      TranscriptSequenceOptionsRequestParams
    >({
      queryFn: async (params, _queryApi, _extraOptions, baseQuery) => {
        const payload = {
          focus_type: 'transcript',
          stable_id: params.transcriptId,
          genome_uuid: params.genomeId,
          sequence_type: params.sequenceType
        };

        const result = await baseQuery({
          url: `${config.annotatedSequenceApi}/sequence-options`,
          method: 'POST',
          body: payload
        });

        if (result.error) {
          return { error: result.error };
        }
        return {
          data: result.data as AnnotatedSequenceOptionsResponsePayload
        };
      }
    }),
    locationSequenceOptions: builder.query<
      AnnotatedSequenceOptionsResponsePayload,
      LocationSequenceOptionsRequestParams
    >({
      queryFn: async (params, _queryApi, _extraOptions, baseQuery) => {
        const payload = {
          focus_type: 'location',
          genome_uuid: params.genomeId,
          region_name: params.regionName,
          start: params.start,
          end: params.end
        };

        const result = await baseQuery({
          url: `${config.annotatedSequenceApi}/sequence-options`,
          method: 'POST',
          body: payload
        });

        if (result.error) {
          return { error: result.error };
        }
        return {
          data: result.data as AnnotatedSequenceOptionsResponsePayload
        };
      }
    })
  })
});

export const { useSequenceViewerGeneQuery } = sequenceViewerThoasSlice;

export const { sequenceViewerGene: fetchSequenceViewerGene } =
  sequenceViewerThoasSlice.endpoints;

export const {
  useGeneSequenceOptionsQuery,
  useTranscriptSequenceOptionsQuery,
  useLocationSequenceOptionsQuery
} = sequenceViewerRestApiSlice;
