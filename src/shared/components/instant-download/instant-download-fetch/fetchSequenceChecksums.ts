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

import { Sequence } from 'src/shared/types/thoas/sequence';

export type TranscriptSequenceMetadata = {
  stable_id: string;
  unversioned_stable_id: string;
  genomic: {
    label: string;
    checksum: string;
    start: number;
    end: number;
  };
  cdna: {
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
  genomic: {
    label: string;
    checksum: string;
    start: number;
    end: number;
  };
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
};

type GeneInResponse = {
  stable_id: string;
  unversioned_stable_id: string;
  slice: SliceInResponse;
};

type GeneWithTranscriptsInResponse = GeneInResponse & {
  transcripts: TranscriptInResponse[];
};

type TranscriptInResponse = {
  stable_id: string;
  unversioned_stable_id: string;
  slice: {
    location: {
      start: number;
      end: number;
    };
    region: {
      sequence: Sequence;
    };
  };
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
    }
  }
`;

const transcriptQueryFragment = gql`
  fragment TranscriptDetails on Transcript {
    stable_id
    unversioned_stable_id
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
    gene(byId: { genome_id: $genomeId, stable_id: $geneId }) {
      ...GeneDetails
    }
    transcript(byId: { genome_id: $genomeId, stable_id: $transcriptId }) {
      ...TranscriptDetails
    }
  }
  ${geneQueryFragment}
  ${transcriptQueryFragment}
`;

const geneChecksumsQuery = gql`
  query Gene($genomeId: String!, $geneId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $geneId }) {
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
    transcript(byId: { genome_id: $genomeId, stable_id: $transcriptId }) {
      ...TranscriptDetails
    }
  }
  ${transcriptQueryFragment}
`;

const processGeneAndTranscriptData = (data: GeneAndTranscriptQueryResult) => {
  const { gene, transcript } = data;

  return {
    gene: processGeneData(gene),
    transcript: processTranscriptData(transcript)
  };
};

const processGeneData = (gene: GeneInResponse) => {
  const {
    stable_id: geneStableId,
    unversioned_stable_id: geneUnversionedStableId,
    slice: geneSlice
  } = gene;

  return {
    stable_id: geneStableId,
    unversioned_stable_id: geneUnversionedStableId,
    genomic: {
      label: `${geneStableId} genomic`,
      checksum: geneSlice.region.sequence.checksum,
      start: geneSlice.location.start,
      end: geneSlice.location.end
    }
  };
};

const processTranscriptData = (transcript: TranscriptInResponse) => {
  const {
    stable_id: transcriptStableId,
    unversioned_stable_id: transcriptUnversionedStableId, // FIXME no longer needed? only required when we requested genomic sequences from REST?
    slice: transcriptSlice
  } = transcript;
  const productGeneratingContext = transcript.product_generating_contexts[0];

  return {
    stable_id: transcriptStableId,
    unversioned_stable_id: transcriptUnversionedStableId,
    genomic: {
      label: `${transcriptStableId} genomic`,
      checksum: transcriptSlice.region.sequence.checksum,
      start: transcriptSlice.location.start,
      end: transcriptSlice.location.end
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
