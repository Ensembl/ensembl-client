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

import { gql } from '@apollo/client';

import { client } from 'src/gql-client';

export type TranscriptChecksums = {
  cdna: {
    sequence_checksum: string;
  };
  cds: {
    sequence_checksum: string;
  };
  product: {
    stable_id: string;
    sequence_checksum: string;
  };
};

export type TranscriptFragment = {
  stable_id: string;
  product_generating_contexts: TranscriptChecksums[];
};

export type TranscriptChecksumsData = {
  transcript: TranscriptFragment;
};

type TranscriptChecksumsVariables = {
  genomeId: string;
  transcriptId: string;
};

export type GeneChecksumsData = {
  gene: {
    transcripts: TranscriptFragment[];
  };
};

type GeneChecksumsVariables = {
  genomeId: string;
  geneId: string;
};

const transcriptChecksumsQuery = gql`
  query Transcript($genomeId: String!, $transcriptId: String!) {
    transcript(byId: { genome_id: $genomeId, stable_id: $transcriptId }) {
      stable_id
      product_generating_contexts {
        cds {
          sequence_checksum
        }
        cdna {
          sequence_checksum
        }
        product {
          stable_id
          sequence_checksum
        }
      }
    }
  }
`;

const geneChecksumsQuery = gql`
  query Gene($genomeId: String!, $geneId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $geneId }) {
      transcripts {
        stable_id
        product_generating_contexts {
          cds {
            sequence_checksum
          }
          cdna {
            sequence_checksum
          }
          product {
            stable_id
            sequence_checksum
          }
        }
      }
    }
  }
`;

export const fetchTranscriptChecksums = (
  variables: TranscriptChecksumsVariables
) =>
  client
    .query<TranscriptChecksumsData>({
      query: transcriptChecksumsQuery,
      variables
    })
    .then(({ data }) => data.transcript.product_generating_contexts[0]);

export const fetchGeneChecksums = (variables: GeneChecksumsVariables) =>
  client
    .query<GeneChecksumsData>({
      query: geneChecksumsQuery,
      variables
    })
    .then(({ data }) => data.gene.transcripts);
