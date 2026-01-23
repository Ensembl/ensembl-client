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
import type { FullProductGeneratingContext } from 'src/shared/types/core-api/productGeneratingContext';

const transcriptFieldsFragment = gql`
  fragment transcriptFields on Transcript {
    stable_id
    product_generating_contexts {
      product_type
    }
  }
`;

export const geneSummaryQuery = gql`
  query Gene($genomeId: String!, $geneId: String!) {
    gene(by_id: { genome_id: $genomeId, stable_id: $geneId }) {
      alternative_symbols
      name
      stable_id
      unversioned_stable_id
      symbol
      transcripts_page(page: 1, per_page: 100) {
        transcripts {
          ...transcriptFields
        }
      }
      slice {
        region {
          sequence {
            checksum
          }
        }
        strand {
          code
        }
        location {
          start
          end
          length
        }
      }
      metadata {
        biotype {
          label
          value
          definition
        }
        name {
          accession_id
          url
        }
      }
    }
  }
  ${transcriptFieldsFragment}
`;

type Transcript = Pick<FullTranscript, 'stable_id'> & {
  product_generating_contexts: Pick<
    FullProductGeneratingContext,
    'product_type'
  >[];
};

type GeneMetadata = Pick2<
  FullGene['metadata'],
  'biotype',
  'label' | 'value' | 'definition'
> & {
  name: Pick<NonNullable<FullGene['metadata']['name']>, 'accession_id' | 'url'>;
};

type GeneSummary = Pick<
  FullGene,
  | 'stable_id'
  | 'unversioned_stable_id'
  | 'symbol'
  | 'name'
  | 'alternative_symbols'
> & {
  metadata: GeneMetadata;
} & Pick3<FullGene, 'slice', 'strand', 'code'> &
  Pick3<FullGene, 'slice', 'location', 'length' | 'start' | 'end'> &
  Pick4<FullGene, 'slice', 'region', 'sequence', 'checksum'> & {
    transcripts: Transcript[];
  };

export type GeneSummaryWithPaginatedTranscripts = Omit<
  GeneSummary,
  'transcripts'
> & {
  transcripts_page: {
    transcripts: GeneSummary['transcripts'];
  };
};

export type GeneSummaryQueryResult = {
  gene: GeneSummary;
};
