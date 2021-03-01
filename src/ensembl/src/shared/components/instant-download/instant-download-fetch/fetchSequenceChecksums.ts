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

export type TranscriptSequenceMetadata = {
  stable_id: string;
  cdna?: {
    checksum: string;
    label: string;
  };
  cds?: {
    checksum: string;
    label: string;
  };
  protein?: {
    checksum: string;
    label: string;
  };
};

export type GeneSequenceMetadata = {
  transcripts: TranscriptSequenceMetadata[];
};

type TranscriptInQuery = {
  stable_id: string; // for apollo client caching
  unversioned_stable_id: string;
  product_generating_contexts: Array<{
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
  }>;
};

type TranscriptQueryResult = {
  transcript: TranscriptInQuery;
};

type GeneQueryResult = {
  gene: {
    transcripts: TranscriptInQuery[];
  };
};

type TranscriptQueryVariables = {
  genomeId: string;
  transcriptId: string;
};

type GeneQueryVariables = {
  genomeId: string;
  geneId: string;
};

const transcriptChecksumsQuery = gql`
  query Transcript($genomeId: String!, $transcriptId: String!) {
    transcript(byId: { genome_id: $genomeId, stable_id: $transcriptId }) {
      stable_id
      unversioned_stable_id
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
      stable_id
      transcripts {
        stable_id
        unversioned_stable_id
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

const processTranscriptData = (transcript: TranscriptInQuery) => {
  // TODO: expect to fetch genomic sequence here as well when checksum becomes available
  const { unversioned_stable_id: stable_id } = transcript; // can't retrieve transcript seq via REST using stable_id
  const productGeneratingContext = transcript.product_generating_contexts[0];

  if (!productGeneratingContext) {
    return { stable_id };
  }

  return {
    stable_id,
    cdna: {
      checksum: productGeneratingContext.cdna.sequence_checksum,
      label: `${stable_id} cdna`
    },
    cds: {
      checksum: productGeneratingContext.cds.sequence_checksum,
      label: `${stable_id} cds`
    },
    protein: {
      checksum: productGeneratingContext.product.sequence_checksum,
      label: `${productGeneratingContext.product.stable_id} pep`
    }
  };
};

export const fetchTranscriptSequenceMetadata = (
  variables: TranscriptQueryVariables
): Promise<TranscriptSequenceMetadata> =>
  client
    .query<TranscriptQueryResult>({
      query: transcriptChecksumsQuery,
      variables
    })
    .then(({ data }) => processTranscriptData(data.transcript));

export const fetchGeneSequenceMetadata = (
  variables: GeneQueryVariables
): Promise<GeneSequenceMetadata> =>
  client
    .query<GeneQueryResult>({
      query: geneChecksumsQuery,
      variables
    })
    .then(({ data }) => ({
      transcripts: data.gene.transcripts.map((transcript) =>
        processTranscriptData(transcript)
      )
    }));
