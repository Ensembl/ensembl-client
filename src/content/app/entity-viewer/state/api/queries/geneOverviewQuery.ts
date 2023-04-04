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

// This query is intended to populate the right-hand sidebar for the gene view
// It looks very similar to geneSummaryQuery; but has a potential of becoming heavier
export const geneOverviewQuery = gql`
  query GeneOverview($genomeId: String!, $geneId: String!) {
    gene(by_id: { genome_id: $genomeId, stable_id: $geneId }) {
      alternative_symbols
      name
      stable_id
      symbol
      metadata {
        name {
          accession_id
          url
        }
        biotype {
          value
        }
      }
    }
  }
`;

export type GeneOverview = Pick<
  FullGene,
  'alternative_symbols' | 'name' | 'stable_id' | 'symbol'
> & {
  metadata: {
    name: Pick<
      NonNullable<FullGene['metadata']['name']>,
      'accession_id' | 'url'
    > | null;
    biotype: Pick<FullGene['metadata']['biotype'], 'value'>;
  };
};

export type GeneOverviewQueryResult = {
  gene: GeneOverview;
};
