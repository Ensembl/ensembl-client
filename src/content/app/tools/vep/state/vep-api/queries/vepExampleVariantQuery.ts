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

import type { Variant } from 'src/shared/types/variation-api/variant';
import type { VariantAllele } from 'src/shared/types/variation-api/variantAllele';

export const variantDefaultQuery = gql`
  query VariantDetails($genomeId: String!, $variantId: String!) {
    variant(by_id: { genome_id: $genomeId, variant_id: $variantId }) {
      name
      slice {
        region {
          name
        }
      }
      alleles {
        slice {
          location {
            start
          }
        }
        allele_sequence
        reference_sequence
      }
    }
  }
`;

export type VepExampleVariantAllele = Pick<
  VariantAllele,
  'allele_sequence' | 'reference_sequence'
> &
  Pick3<VariantAllele, 'slice', 'location', 'start'>;

export type VepExampleVariant = Pick<Variant, 'name'> &
  Pick3<Variant, 'slice', 'region', 'name'> & {
    alleles: VepExampleVariantAllele[];
  };

export type VepExampleVariantQueryResult = {
  variant: VepExampleVariant;
};
