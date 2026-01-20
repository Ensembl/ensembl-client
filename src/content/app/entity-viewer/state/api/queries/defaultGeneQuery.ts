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
import type { SplicedExon, PhasedExon } from 'src/shared/types/core-api/exon';
import type { FullProductGeneratingContext } from 'src/shared/types/core-api/productGeneratingContext';
import type { Product } from 'src/shared/types/core-api/product';
import type { TranscriptMetadata } from 'src/shared/types/core-api/metadata';

export const defaultGeneQuery = gql`
  query DefaultEntityViewerGene($genomeId: String!, $geneId: String!) {
    gene(by_id: { genome_id: $genomeId, stable_id: $geneId }) {
      stable_id
      symbol
      unversioned_stable_id
      version
      slice {
        location {
          start
          end
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
            start
            end
            length
          }
          region {
            name
          }
          strand {
            code
          }
        }
        relative_location {
          start
          end
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
          cds {
            relative_start
            relative_end
          }
          cdna {
            length
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
            unversioned_stable_id
            length
            external_references {
              accession_id
              name
              description
              source {
                id
              }
            }
          }
        }
        external_references {
          accession_id
          name
          url
          source {
            id
            name
          }
        }
        metadata {
          biotype {
            label
            value
            definition
          }
          tsl {
            label
            value
          }
          appris {
            label
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
            ncbi_transcript {
              id
              url
            }
          }
          gencode_basic {
            label
          }
        }
      }
    }
  }
`;

type GeneFields = Pick<
  FullGene,
  'stable_id' | 'unversioned_stable_id' | 'symbol' | 'version'
>;
type GeneSlice = Pick2<FullGene, 'slice', 'location'> &
  Pick3<FullGene, 'slice', 'strand', 'code'>;

type SplicedExonOnDefaultTranscript = Pick2<
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

type ProductOnDefaultTranscript = Pick<
  Product,
  'stable_id' | 'unversioned_stable_id' | 'length'
> & {
  external_references: ExternalReferenceInProduct[];
};

type ExternalReferenceInProduct = Pick<
  Product['external_references'][number],
  'accession_id' | 'name' | 'description'
> &
  Pick2<Product['external_references'][number], 'source', 'id'>;

type TranscriptExternalReference = Pick<
  FullTranscript['external_references'][number],
  'accession_id' | 'name' | 'url'
> &
  Pick2<FullTranscript['external_references'][number], 'source', 'name' | 'id'>;

type ProductGeneratingContextOnDefaultTranscript = Pick<
  FullProductGeneratingContext,
  'product_type'
> & {
  cds: {
    relative_start: NonNullable<
      FullProductGeneratingContext['cds']
    >['relative_start'];
    relative_end: NonNullable<
      FullProductGeneratingContext['cds']
    >['relative_end'];
  } | null;
  cdna: {
    length: NonNullable<FullProductGeneratingContext['cdna']>['length'];
  } | null;
  phased_exons: PhasedExonOfDefaultTranscript[];
  product: ProductOnDefaultTranscript | null;
};

export type DefaultEntityViewerTranscript = Pick<
  FullTranscript,
  'stable_id' | 'unversioned_stable_id'
> &
  Pick2<FullTranscript, 'slice', 'location'> &
  Pick3<FullTranscript, 'slice', 'region', 'name'> &
  Pick3<FullTranscript, 'slice', 'strand', 'code'> &
  Pick2<FullTranscript, 'relative_location', 'start' | 'end'> & {
    spliced_exons: SplicedExonOnDefaultTranscript[];
    external_references: TranscriptExternalReference[];
    product_generating_contexts: ProductGeneratingContextOnDefaultTranscript[];
    metadata: DefaultEntityViewerTranscriptMetadata;
  };

type DefaultEntityViewerTranscriptMetadata = Pick2<
  TranscriptMetadata,
  'biotype',
  'label' | 'value' | 'definition'
> & {
  tsl: Pick<NonNullable<TranscriptMetadata['tsl']>, 'label' | 'value'> | null;
  appris: Pick<
    NonNullable<TranscriptMetadata['appris']>,
    'label' | 'value'
  > | null;
  gencode_basic: Pick<
    NonNullable<TranscriptMetadata['gencode_basic']>,
    'label'
  > | null;
  canonical: Pick<
    NonNullable<TranscriptMetadata['canonical']>,
    'label' | 'value' | 'definition'
  > | null;
  mane: Pick<
    NonNullable<TranscriptMetadata['mane']>,
    'label' | 'value' | 'definition' | 'ncbi_transcript'
  > | null;
};

export type DefaultEntityViewerGene = GeneFields &
  GeneSlice & {
    transcripts: DefaultEntityViewerTranscript[];
  };

export type DefaultEntityViewerGeneQueryResult = {
  gene: DefaultEntityViewerGene;
};
