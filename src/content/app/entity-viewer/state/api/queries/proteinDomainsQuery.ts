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

import type { FamilyMatch } from 'src/shared/types/thoas/product';

export const proteinDomainsQuery = gql`
  query ProteinDomains($genomeId: String!, $productId: String!) {
    product(genome_id: $genomeId, stable_id: $productId) {
      length
      family_matches {
        relative_location {
          start
          end
        }
        sequence_family {
          name
          description
          source {
            name
          }
        }
      }
    }
  }
`;

export type FamilyMatchProduct = Pick2<
  FamilyMatch,
  'relative_location',
  'start' | 'end'
> &
  Pick2<FamilyMatch, 'sequence_family', 'name' | 'description'> &
  Pick3<FamilyMatch, 'sequence_family', 'source', 'name'>;

export type ProteinDomainsQueryResult = {
  product: {
    length: number;
    family_matches: FamilyMatchProduct[];
  };
};
