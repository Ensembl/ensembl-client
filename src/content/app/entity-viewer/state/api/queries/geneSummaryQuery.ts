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
import { Pick3 } from 'ts-multipick';

import type { FullGene } from 'src/shared/types/core-api/gene';

// A light query to get brief information about a gene.
// Useful for populating the top bar and example links in the interstitial.
export const geneSummaryQuery = gql`
  query GeneSummary($genomeId: String!, $geneId: String!) {
    gene(by_id: { genome_id: $genomeId, stable_id: $geneId }) {
      stable_id
      unversioned_stable_id
      symbol
      slice {
        location {
          start
          end
        }
        strand {
          code
        }
        region {
          name
        }
      }
      metadata {
        biotype {
          label
        }
      }
    }
  }
`;

export type GeneSummary = Pick<
  FullGene,
  'stable_id' | 'unversioned_stable_id' | 'symbol'
> &
  Pick3<FullGene, 'slice', 'location', 'start' | 'end'> &
  Pick3<FullGene, 'slice', 'strand', 'code'> &
  Pick3<FullGene, 'slice', 'region', 'name'> &
  Pick3<FullGene, 'metadata', 'biotype', 'label'>;

export type GeneSummaryQueryResult = {
  gene: GeneSummary;
};
