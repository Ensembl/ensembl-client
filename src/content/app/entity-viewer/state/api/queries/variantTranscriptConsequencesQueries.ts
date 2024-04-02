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

export const geneForVariantTranscriptConsequencesQuery = gql`
  query GeneForVariantTranscriptConsequences(
    $genomeId: String!
    $geneId: String!
  ) {
    gene(by_id: { genome_id: $genomeId, stable_id: $geneId }) {
      stable_id
      unversioned_stable_id
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
      transcripts {
        stable_id
        unversioned_stable_id
        slice {
          location {
            length
          }
        }
        metadata {
          biotype {
            value
          }
          canonical {
            value
            label
            definition
          }
          mane {
            value
            label
            definition
          }
        }
        product_generating_contexts {
          product_type
          product {
            length
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
        product {
          stable_id
          length
          sequence {
            checksum
          }
        }
      }
    }
  }
`;

type ProductGeneratingContextInTranscriptInGene = Pick<
  FullProductGeneratingContext,
  'product_type'
> & {
  product: Pick<
    NonNullable<FullProductGeneratingContext['product']>,
    'length'
  > | null;
};

type TranscriptInGene = Pick<
  FullTranscript,
  'stable_id' | 'unversioned_stable_id'
> &
  Pick3<FullTranscript, 'slice', 'location', 'length'> &
  Pick3<FullTranscript, 'metadata', 'biotype', 'value'> & {
    metadata: {
      canonical: Pick<
        NonNullable<FullTranscript['metadata']['canonical']>,
        'value' | 'label' | 'definition'
      > | null;
      mane: Pick<
        NonNullable<FullTranscript['metadata']['mane']>,
        'value' | 'label' | 'definition'
      > | null;
    };
    product_generating_contexts: ProductGeneratingContextInTranscriptInGene[];
  };

type GeneInResponse = Pick<
  FullGene,
  'stable_id' | 'unversioned_stable_id' | 'symbol'
> &
  Pick3<FullGene, 'slice', 'location', 'start' | 'end' | 'length'> &
  Pick3<FullGene, 'slice', 'region', 'length'> &
  Pick4<FullGene, 'slice', 'region', 'sequence', 'checksum'> &
  Pick3<FullGene, 'slice', 'strand', 'code'> & {
    transcripts: TranscriptInGene[];
  };

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
  product: {
    stable_id: NonNullable<
      FullProductGeneratingContext['product']
    >['stable_id'];
    length: NonNullable<FullProductGeneratingContext['product']>['length'];
    sequence: Pick<
      NonNullable<FullProductGeneratingContext['product']>['sequence'],
      'checksum'
    >;
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
  gene: GeneInResponse;
};

export type TranscriptForVariantTranscriptConsequencesResponse = {
  transcript: TranscriptInResponse;
};
