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
import { Sequence } from 'ensemblRoot/src/shared/types/thoas/sequence';

import { client } from 'src/gql-client';

export type TranscriptSequenceMetadata = {
  stable_id: string;
  unversioned_stable_id: string;
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
  stable_id: string;
  unversioned_stable_id: string;
  transcripts: TranscriptSequenceMetadata[];
};

type TranscriptInResponse = {
  stable_id: string; // for apollo client caching
  unversioned_stable_id: string;
  product_generating_contexts: Array<{
    cdna: {
      sequence: Sequence;
    };
    cds: {
      sequence: Sequence;
    };
    product: {
      stable_id: string;
      sequence: Sequence;
    };
  }>;
};

type TranscriptQueryResult = {
  transcript: TranscriptInResponse;
};

type GeneQueryResult = {
  gene: {
    stable_id: string;
    unversioned_stable_id: string;
    transcripts: TranscriptInResponse[];
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
          sequence {
            checksum
          }
        }
        cdna {
          sequence {
            checksum
          }
        }
        product {
          stable_id
          sequence {
            checksum
          }
        }
      }
    }
  }
`;

const onlyGeneQuery = gql`
  query Gene($genomeId: String!, $geneId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $geneId }) {
      stable_id
      unversioned_stable_id
    }
  }
`;

const geneChecksumsQuery = gql`
  query Gene($genomeId: String!, $geneId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $geneId }) {
      stable_id
      unversioned_stable_id
      transcripts {
        stable_id
        unversioned_stable_id
        product_generating_contexts {
          cds {
            sequence {
              checksum
            }
          }
          cdna {
            sequence {
              checksum
            }
          }
          product {
            stable_id
            sequence {
              checksum
            }
          }
        }
      }
    }
  }
`;

const processTranscriptData = (transcript: TranscriptInResponse) => {
  // TODO: expect to fetch genomic sequence here as well when checksum becomes available
  const { stable_id, unversioned_stable_id } = transcript; // can't retrieve transcript seq via REST using stable_id
  const productGeneratingContext = transcript.product_generating_contexts[0];

  if (!productGeneratingContext) {
    return {
      stable_id,
      unversioned_stable_id
    };
  }

  return {
    stable_id,
    unversioned_stable_id,
    cdna: {
      checksum: productGeneratingContext.cdna.sequence.checksum,
      label: `${stable_id} cdna`
    },
    cds: {
      checksum: productGeneratingContext.cds.sequence.checksum,
      label: `${stable_id} cds`
    },
    protein: {
      checksum: productGeneratingContext.product.sequence.checksum,
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

type OnlyGeneSequenceMetadata = {
  stable_id: string;
  unversioned_stable_id: string;
};
// temporary function; will change it to fetch gene sequence checksum when available
export const fetchGeneWithoutTranscriptsSequenceMetadata = (
  variables: GeneQueryVariables
): Promise<OnlyGeneSequenceMetadata> =>
  client
    .query<{ gene: OnlyGeneSequenceMetadata }>({
      query: onlyGeneQuery,
      variables
    })
    .then(({ data }) => data.gene);

export const fetchGeneSequenceMetadata = (
  variables: GeneQueryVariables
): Promise<GeneSequenceMetadata> =>
  client
    .query<GeneQueryResult>({
      query: geneChecksumsQuery,
      variables
    })
    .then(({ data }) => ({
      stable_id: data.gene.stable_id,
      unversioned_stable_id: data.gene.unversioned_stable_id,
      transcripts: data.gene.transcripts.map((transcript) =>
        processTranscriptData(transcript)
      )
    }));
