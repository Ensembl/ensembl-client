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
import type { Pick2, Pick3, Pick4 } from 'ts-multipick';

import type { FullGene } from 'src/shared/types/core-api/gene';
import type { FullTranscript } from 'src/shared/types/core-api/transcript';
import type { FullProductGeneratingContext } from 'src/shared/types/core-api/productGeneratingContext';

/**
 * As a temporary solution, this query fetches gene
 * using the transcript stable id
 */

// NOTE: transcriptId as an input parameter will later be replaced with gene stable id
export const geneForVariantTranscriptConsequencesQuery = gql`
  query GeneForVariantTranscriptConsequences(
    $genomeId: String!
    $transcriptId: String!
  ) {
    transcript(by_id: { genome_id: $genomeId, stable_id: $transcriptId }) {
      gene {
        stable_id
        symbol
        slice {
          location {
            start
            end
            length
          }
          region {
            sequence {
              checksum
            }
            length
          }
          strand {
            code
          }
        }
      }
    }
  }
`;

export const transcriptForVariantTranscriptConsequencesQuery = gql`
  query TranscriptForVariantTranscriptConsequences(
    $genomeId: String!
    $transcriptId: String!
  ) {
    transcript(by_id: { genome_id: $genomeId, stable_id: $transcriptId }) {
      slice {
        location {
          start
          end
          length
        }
      }
      relative_location {
        start
        end
        length
      }
      spliced_exons {
        index
        relative_location {
          start
          end
          length
        }
      }
      product_generating_contexts {
        cds {
          relative_start
          relative_end
          nucleotide_length
        }
      }
    }
  }
`;

type GeneInResponse = Pick<FullGene, 'stable_id' | 'symbol'> &
  Pick3<FullGene, 'slice', 'location', 'start' | 'end' | 'length'> &
  Pick3<FullGene, 'slice', 'region', 'length'> &
  Pick4<FullGene, 'slice', 'region', 'sequence', 'checksum'> &
  Pick3<FullGene, 'slice', 'strand', 'code'>;

type SplicedExonInTranscript = Pick<
  FullTranscript['spliced_exons'][number],
  'index'
> &
  Pick2<
    FullTranscript['spliced_exons'][number],
    'relative_location',
    'start' | 'end' | 'length'
  >;
type ProductGeneratingContextInTranscript = {
  cds: {
    relative_start: NonNullable<
      FullProductGeneratingContext['cds']
    >['relative_start'];
    relative_end: NonNullable<
      FullProductGeneratingContext['cds']
    >['relative_end'];
    nucleotide_length: NonNullable<
      FullProductGeneratingContext['cds']
    >['nucleotide_length'];
  } | null;
};

type TranscriptInResponse = Pick3<
  FullTranscript,
  'slice',
  'location',
  'start' | 'end' | 'length'
> &
  Pick2<FullTranscript, 'relative_location', 'start' | 'end'> & {
    spliced_exons: SplicedExonInTranscript[];
    product_generating_contexts: ProductGeneratingContextInTranscript[];
  };

export type GeneForVariantTranscriptConsequencesResponse = {
  transcript: {
    gene: GeneInResponse; // NOTE: later on, gene will be the top-level field
  };
};

export type TranscriptForVariantTranscriptConsequencesResponse = {
  transcript: TranscriptInResponse;
};
