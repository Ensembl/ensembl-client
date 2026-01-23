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
import { Pick2, Pick3 } from 'ts-multipick';

import type { FullGene } from 'src/shared/types/core-api/gene';
import type { FullTranscript } from 'src/shared/types/core-api/transcript';
import type { FullProductGeneratingContext } from 'src/shared/types/core-api/productGeneratingContext';
import type { TranscriptMetadata } from 'src/shared/types/core-api/metadata';
import type { ExternalReference } from 'src/shared/types/core-api/externalReference';

const transcriptFieldsFragment = gql`
  fragment transcriptFields on Transcript {
    stable_id
    slice {
      location {
        length
      }
    }
    external_references {
      accession_id
      name
      description
      url
      source {
        id
        name
      }
    }
    product_generating_contexts {
      product_type
      product {
        external_references {
          accession_id
          name
          description
          url
          source {
            id
            name
          }
        }
      }
    }
    metadata {
      canonical {
        value
      }
      mane {
        value
      }
      biotype {
        value
      }
    }
  }
`;

export const geneExternalReferencesQuery = gql`
  query GeneExternalReferences($geneId: String!, $genomeId: String!) {
    gene(by_id: { stable_id: $geneId, genome_id: $genomeId }) {
      stable_id
      symbol
      external_references {
        accession_id
        name
        description
        url
        source {
          id
          name
        }
      }
      transcripts_page(page: 1, per_page: 100) {
        transcripts {
          ...transcriptFields
        }
      }
    }
  }
  ${transcriptFieldsFragment}
`;

export type QueriedExternalReference = Pick<
  ExternalReference,
  'accession_id' | 'name' | 'description' | 'url'
> &
  Pick2<ExternalReference, 'source', 'id' | 'name'>;

export type QueriedTranscript = Pick<FullTranscript, 'stable_id'> &
  Pick3<FullTranscript, 'slice', 'location', 'length'> & {
    metadata: {
      canonical: Pick<
        NonNullable<TranscriptMetadata['canonical']>,
        'label' | 'value' | 'definition'
      > | null;
      mane: Pick<NonNullable<TranscriptMetadata['mane']>, 'value'> | null;
      biotype: Pick<TranscriptMetadata['biotype'], 'value'>;
    };
    external_references: QueriedExternalReference[];
    product_generating_contexts: QueriedProductGeneratingContext[];
  };

type QueriedProductGeneratingContext = Pick<
  FullProductGeneratingContext,
  'product_type'
> & {
  product: QueriedProduct;
};

type QueriedProduct = {
  external_references: QueriedExternalReference[];
};

export type GeneWithExternalReferences = Pick<
  FullGene,
  'stable_id' | 'symbol'
> & {
  external_references: QueriedExternalReference[];
  transcripts: QueriedTranscript[];
};

export type GeneWithExternalReferencesAndTranscriptsPage = Omit<
  GeneWithExternalReferences,
  'transcripts'
> & {
  transcripts_page: {
    transcripts: GeneWithExternalReferences['transcripts'];
  };
};

export type GeneExternalReferencesQueryResult = {
  gene: GeneWithExternalReferences;
};
