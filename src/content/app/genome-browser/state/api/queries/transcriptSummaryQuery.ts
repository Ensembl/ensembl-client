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

import { FullGene } from 'src/shared/types/thoas/gene';
import { FullTranscript } from 'src/shared/types/thoas/transcript';
import type { SplicedExon, PhasedExon } from 'src/shared/types/thoas/exon';
import { FullProductGeneratingContext } from 'src/shared/types/thoas/productGeneratingContext';
import type { TranscriptMetadata } from 'src/shared/types/thoas/metadata';

export const transcriptSummaryQuery = gql`
  query TranscriptSummary($genomeId: String!, $transcriptId: String!) {
    transcript(byId: { genome_id: $genomeId, stable_id: $transcriptId }) {
      stable_id
      unversioned_stable_id
      external_references {
        accession_id
        url
        source {
          id
        }
      }
      spliced_exons {
        relative_location {
          start
          end
        }
        exon {
          stable_id
          slice {
            location {
              length
            }
          }
        }
      }
      product_generating_contexts {
        product_type
        default
        cds {
          protein_length
          sequence {
            checksum
          }
        }
        cdna {
          sequence {
            checksum
          }
        }
        phased_exons {
          start_phase
          end_phase
          exon {
            stable_id
          }
        }
        product {
          stable_id
          external_references {
            accession_id
            url
            source {
              id
            }
          }
          sequence {
            checksum
          }
        }
      }
      slice {
        strand {
          code
        }
        location {
          start
          end
          length
        }
        region {
          name
          sequence {
            checksum
          }
        }
      }
      metadata {
        biotype {
          label
          value
          definition
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
      gene {
        name
        stable_id
        unversioned_stable_id
        symbol
      }
    }
  }
`;

type GeneInSummaryTranscript = Pick<
  FullGene,
  'name' | 'stable_id' | 'unversioned_stable_id' | 'symbol'
>;

type SummaryTranscriptMetadata = Pick2<
  TranscriptMetadata,
  'biotype',
  'label' | 'value' | 'definition'
> & {
  canonical: Pick<
    NonNullable<TranscriptMetadata['canonical']>,
    'label' | 'value' | 'definition'
  > | null;
  mane: Pick<
    NonNullable<TranscriptMetadata['mane']>,
    'label' | 'value' | 'definition'
  > | null;
};

type RequestedExternalReference = Pick<
  FullTranscript['external_references'][number],
  'accession_id' | 'url'
> &
  Pick2<FullTranscript['external_references'][number], 'source', 'id'>;

type SplicedExonOnSummaryTranscript = Pick2<
  SplicedExon,
  'relative_location',
  'start' | 'end'
> &
  Pick2<SplicedExon, 'exon', 'stable_id'> &
  Pick4<SplicedExon, 'exon', 'slice', 'location', 'length'>;

type PhasedExonOfDefaultTranscript = Pick<
  PhasedExon,
  'start_phase' | 'end_phase'
> &
  Pick2<PhasedExon, 'exon', 'stable_id'>;

type ProductGeneratingContextOnSummaryTranscript = Pick<
  FullProductGeneratingContext,
  'product_type' | 'default'
> & {
  cds:
    | (Pick<
        NonNullable<FullProductGeneratingContext['cds']>,
        'protein_length'
      > &
        Pick2<
          NonNullable<FullProductGeneratingContext['cds']>,
          'sequence',
          'checksum'
        >)
    | null;
  cdna: Pick2<
    NonNullable<FullProductGeneratingContext['cdna']>,
    'sequence',
    'checksum'
  > | null;
  phased_exons: PhasedExonOfDefaultTranscript[];
  product:
    | ({
        stable_id: string;
        external_references: RequestedExternalReference[];
      } & Pick2<
        NonNullable<FullProductGeneratingContext['product']>,
        'sequence',
        'checksum'
      >)
    | null;
};

type SummaryTranscript = Pick<
  FullTranscript,
  'stable_id' | 'unversioned_stable_id'
> &
  Pick3<FullTranscript, 'slice', 'strand', 'code'> &
  Pick4<FullTranscript, 'slice', 'region', 'sequence', 'checksum'> &
  Pick3<FullTranscript, 'slice', 'location', 'length' | 'start' | 'end'> &
  Pick3<FullTranscript, 'slice', 'region', 'name'> & {
    metadata: SummaryTranscriptMetadata;
    gene: GeneInSummaryTranscript;
    spliced_exons: SplicedExonOnSummaryTranscript[];
    product_generating_contexts: ProductGeneratingContextOnSummaryTranscript[];
    external_references: RequestedExternalReference[];
  };

export type TranscriptSummaryQueryResult = {
  transcript: SummaryTranscript;
};
