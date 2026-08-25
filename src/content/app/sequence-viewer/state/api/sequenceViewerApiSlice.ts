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

import { gql } from 'graphql-request';
import config from 'config';

import graphqlApiSlice from 'src/shared/state/api-slices/graphqlApiSlice';
import type { Strand } from 'src/shared/types/core-api/strand';

type Feature = {
  slice: {
    location: { start: number; end: number };
    region: { name: string; length: number; sequence: { checksum: string } };
    strand: { code: Strand };
  };
};

type FeatureQueryParams = {
  genomeId: string;
  featureId: string;
};

const sequenceFields = gql`
  fragment sequenceFields on Slice {
    location {
      start
      end
    }
    region {
      name
      length
      sequence {
        checksum
      }
    }
    strand {
      code
    }
  }
`;

const geneSequenceQuery = gql`
  query SequenceViewerGene($genomeId: String!, $featureId: String!) {
    gene(by_id: { genome_id: $genomeId, stable_id: $featureId }) {
      slice {
        ...sequenceFields
      }
    }
  }
  ${sequenceFields}
`;

const transcriptSequenceQuery = gql`
  query SequenceViewerTranscript($genomeId: String!, $featureId: String!) {
    transcript(by_id: { genome_id: $genomeId, stable_id: $featureId }) {
      slice {
        ...sequenceFields
      }
    }
  }
  ${sequenceFields}
`;

const sequenceViewerApiSlice = graphqlApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sequenceViewerGene: builder.query<Feature, FeatureQueryParams>({
      query: ({ genomeId, featureId }) => ({
        url: config.coreApiUrl,
        body: geneSequenceQuery,
        variables: { genomeId, featureId }
      }),
      transformResponse: (response: { gene: Feature }) => response.gene
    }),
    sequenceViewerTranscript: builder.query<Feature, FeatureQueryParams>({
      query: ({ genomeId, featureId }) => ({
        url: config.coreApiUrl,
        body: transcriptSequenceQuery,
        variables: { genomeId, featureId }
      }),
      transformResponse: (response: { transcript: Feature }) =>
        response.transcript
    })
  })
});

export const { useSequenceViewerGeneQuery, useSequenceViewerTranscriptQuery } =
  sequenceViewerApiSlice;
