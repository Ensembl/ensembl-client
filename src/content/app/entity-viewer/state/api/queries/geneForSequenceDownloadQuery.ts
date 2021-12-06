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

import type { FullGene } from 'src/shared/types/thoas/gene';
import type { FullProductGeneratingContext } from 'src/shared/types/thoas/productGeneratingContext';

export const geneForSequenceDownloadQuery = gql`
  query GeneForSequenceDownload($genomeId: String!, $geneId: String!) {
    gene(byId: { genome_id: $genomeId, stable_id: $geneId }) {
      stable_id
      transcripts {
        product_generating_contexts {
          product_type
        }
      }
    }
  }
`;

export type GeneForSequenceDownload = Pick<FullGene, 'stable_id'> & {
  transcripts: {
    product_generating_contexts: Pick<
      FullProductGeneratingContext,
      'product_type'
    >[];
  }[];
};

export type GeneForSequenceDownloadQueryResult = {
  gene: GeneForSequenceDownload;
};
