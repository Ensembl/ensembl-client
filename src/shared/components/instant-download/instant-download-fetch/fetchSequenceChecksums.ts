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

import { request, gql } from 'graphql-request';

import type { Sequence } from 'src/shared/types/thoas/sequence';
import type { Strand } from 'src/shared/types/thoas/strand';

type NonGenomicSequenceMetadata = {
  checksum: string;
  label: string;
};

type GenomicSequenceMetadata = {
  label: string;
  checksum: string;
  start: number;
  end: number;
  strand: Strand;
};

export type TranscriptSequenceMetadata = {
  stable_id: string;
  genomic: GenomicSequenceMetadata;
  cdna: NonGenomicSequenceMetadata;
  cds?: NonGenomicSequenceMetadata;
  protein?: NonGenomicSequenceMetadata;
};

export type GeneSequenceMetadata = {
  stable_id: string;
  genomic: GenomicSequenceMetadata;
};

export type GeneAndTranscriptSequenceMetadata = {
  gene: GeneSequenceMetadata;
  transcript: TranscriptSequenceMetadata;
};

export type GeneWithTranscriptsSequenceMetadata = GeneSequenceMetadata & {
  transcripts: TranscriptSequenceMetadata[];
};

type SliceInResponse = {
  location: {
    start: number;
    end: number;
  };
  region: {
    sequence: Sequence;
  };
  strand: {
    code: Strand;
  };
};

type GeneInResponse = {
  stable_id: string;
  slice: SliceInResponse;
};

type GeneWithTranscriptsInResponse = GeneInResponse & {
  transcripts: TranscriptInResponse[];
};

type TranscriptInResponse = {
  stable_id: string;
  slice: SliceInResponse;
  product_generating_contexts: Array<{
    cdna: {
      sequence: Sequence;
    };
    cds: {
      sequence: Sequence;
    } | null;
    product: {
      stable_id: string;
      sequence: Sequence;
    } | null;
  }>;
};

type GeneAndTranscriptQueryResult = {
  gene: GeneInResponse;
  transcript: TranscriptInResponse;
};

type GeneQueryResult = {
  gene: GeneWithTranscriptsInResponse;
};

type TranscriptQueryResult = {
  transcript: TranscriptInResponse;
};

type RegionSequenceChecksumQueryResult = {
  region: {
    sequence: {
      checksum: string;
    };
  };
};

type GeneAndTranscriptQueryVariables = {
  genomeId: string;
  geneId: string;
  transcriptId: string;
};

type TranscriptQueryVariables = {
  genomeId: string;
  transcriptId: string;
};

type GeneQueryVariables = {
  genomeId: string;
  geneId: string;
};

const geneQueryFragment = gql`
  fragment GeneDetails on Gene {
    stable_id
    slice {
      location {
        start
        end
      }
      region {
        sequence {
          checksum
        }
      }
      strand {
        code
      }
    }
  }
`;

const transcriptQueryFragment = gql`
  fragment TranscriptDetails on Transcript {
    stable_id
    slice {
      location {
        start
        end
      }
      region {
        sequence {
          checksum
        }
      }
      strand {
        code
      }
    }
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
`;

const geneAndTranscriptChecksumsQuery = gql`
  query GeneAndTranscript(
    $genomeId: String!
    $geneId: String!
    $transcriptId: String!
  ) {
    gene(by_id: { genome_id: $genomeId, stable_id: $geneId }) {
      ...GeneDetails
    }
    transcript(by_id: { genome_id: $genomeId, stable_id: $transcriptId }) {
      ...TranscriptDetails
    }
  }
  ${geneQueryFragment}
  ${transcriptQueryFragment}
`;

const geneChecksumsQuery = gql`
  query Gene($genomeId: String!, $geneId: String!) {
    gene(by_id: { genome_id: $genomeId, stable_id: $geneId }) {
      ...GeneDetails
      transcripts {
        ...TranscriptDetails
      }
    }
  }
  ${geneQueryFragment}
  ${transcriptQueryFragment}
`;

const transcriptChecksumsQuery = gql`
  query Transcript($genomeId: String!, $transcriptId: String!) {
    transcript(by_id: { genome_id: $genomeId, stable_id: $transcriptId }) {
      ...TranscriptDetails
    }
  }
  ${transcriptQueryFragment}
`;

const regioSequenceChecksumQuery = gql`
  query Region($genomeId: String!, $regionName: String!) {
    region(by_name: { genome_id: $genomeId, name: $regionName }) {
      sequence {
        checksum
      }
    }
  }
`;

const processGeneAndTranscriptData = (data: GeneAndTranscriptQueryResult) => {
  const { gene, transcript } = data;

  return {
    gene: processGeneData(gene),
    transcript: processTranscriptData(transcript)
  };
};

const processGeneData = (gene: GeneInResponse) => {
  const { stable_id: geneStableId, slice: geneSlice } = gene;

  return {
    stable_id: geneStableId,
    genomic: {
      label: `${geneStableId} genomic`,
      checksum: geneSlice.region.sequence.checksum,
      start: geneSlice.location.start,
      end: geneSlice.location.end,
      strand: geneSlice.strand.code
    }
  };
};

const processTranscriptData = (transcript: TranscriptInResponse) => {
  const { stable_id: transcriptStableId, slice: transcriptSlice } = transcript;
  const productGeneratingContext = transcript.product_generating_contexts[0];

  return {
    stable_id: transcriptStableId,
    genomic: {
      label: `${transcriptStableId} genomic`,
      checksum: transcriptSlice.region.sequence.checksum,
      start: transcriptSlice.location.start,
      end: transcriptSlice.location.end,
      strand: transcriptSlice.strand.code
    },
    cdna: {
      checksum: productGeneratingContext.cdna.sequence.checksum,
      label: `${transcriptStableId} cdna`
    },
    cds: productGeneratingContext.cds
      ? {
          checksum: productGeneratingContext.cds.sequence.checksum,
          label: `${transcriptStableId} cds`
        }
      : undefined,
    protein: productGeneratingContext.product
      ? {
          checksum: productGeneratingContext.product.sequence.checksum,
          label: `${productGeneratingContext.product.stable_id} pep`
        }
      : undefined
  };
};

export const fetchGeneAndTranscriptSequenceMetadata = (
  variables: GeneAndTranscriptQueryVariables
): Promise<GeneAndTranscriptSequenceMetadata> =>
  request<GeneAndTranscriptQueryResult>(
    '/api/thoas',
    geneAndTranscriptChecksumsQuery,
    variables
  ).then((data) => processGeneAndTranscriptData(data));

export const fetchGeneSequenceMetadata = (
  variables: GeneQueryVariables
): Promise<GeneWithTranscriptsSequenceMetadata> =>
  request<GeneQueryResult>('/api/thoas', geneChecksumsQuery, variables).then(
    (data) => ({
      ...processGeneData(data.gene),
      transcripts: data.gene.transcripts.map((transcript) =>
        processTranscriptData(transcript)
      )
    })
  );

export const fetchTranscriptSequenceMetadata = (
  variables: TranscriptQueryVariables
): Promise<TranscriptSequenceMetadata> => {
  return request<TranscriptQueryResult>(
    '/api/thoas',
    transcriptChecksumsQuery,
    variables
  ).then((data) => processTranscriptData(data.transcript));
};

export const fetchRegionSequenceChecksum = async (variables: {
  genomeId: string;
  regionName: string;
}): Promise<string> => {
  const data = await request<RegionSequenceChecksumQueryResult>(
    '/api/thoas',
    regioSequenceChecksumQuery,
    variables
  );
  return data.region.sequence.checksum;
};
