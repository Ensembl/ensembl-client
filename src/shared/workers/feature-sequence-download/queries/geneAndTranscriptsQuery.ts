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
import { Pick2, Pick3, Pick4 } from 'ts-multipick';

import type { FullGene } from 'src/shared/types/core-api/gene';
import type { FullTranscript } from 'src/shared/types/core-api/transcript';
import type { SplicedExon } from 'src/shared/types/core-api/exon';
import type { FullProductGeneratingContext } from 'src/shared/types/core-api/productGeneratingContext';

const geneAndTranscriptsFragment = gql`
  fragment GeneAndTranscripts on Gene {
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
    transcripts {
      stable_id
      relative_location {
        start
        end
      }
      spliced_exons {
        index
        relative_location {
          start
          end
        }
        exon {
          stable_id
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
  }
`;

export const geneAndTranscriptsQuery = gql`
  query GeneAndTranscripts($genomeId: String!, $geneId: String!) {
    gene(by_id: { genome_id: $genomeId, stable_id: $geneId }) {
      ...GeneAndTranscripts
    }
  }
  ${geneAndTranscriptsFragment}
`;

export const transcriptAndGeneQuery = gql`
  query TranscriptAndGene($genomeId: String!, $transcriptId: String!) {
    transcript(by_id: { genome_id: $genomeId, stable_id: $transcriptId }) {
      gene {
        ...GeneAndTranscripts
      }
    }
  }
  ${geneAndTranscriptsFragment}
`;

type ExonInResponse = Pick<SplicedExon, 'index' | 'relative_location'> &
  Pick2<SplicedExon, 'exon', 'stable_id'>;

type ProductInResponse = Pick<
  NonNullable<FullProductGeneratingContext['product']>,
  'stable_id'
> &
  Pick2<
    NonNullable<FullProductGeneratingContext['product']>,
    'sequence',
    'checksum'
  >;

type ProductGeneratingContextInResponse = Pick3<
  FullProductGeneratingContext,
  'cdna',
  'sequence',
  'checksum'
> & {
  cds: Pick2<
    NonNullable<FullProductGeneratingContext['cds']>,
    'sequence',
    'checksum'
  > | null;
  product: ProductInResponse | null;
};

export type TranscriptInResponse = Pick<
  FullTranscript,
  'stable_id' | 'relative_location'
> & {
  spliced_exons: ExonInResponse[];
  product_generating_contexts: ProductGeneratingContextInResponse[];
};

type GeneInResponse = Pick<FullGene, 'stable_id'> &
  Pick3<FullGene, 'slice', 'location', 'start' | 'end'> &
  Pick3<FullGene, 'slice', 'strand', 'code'> &
  Pick4<FullGene, 'slice', 'region', 'sequence', 'checksum'> & {
    transcripts: TranscriptInResponse[];
  };

export type GeneAndTranscriptsResponse = {
  gene: GeneInResponse;
};

export type TranscriptAndGeneResponse = {
  transcript: {
    gene: GeneInResponse;
  };
};
