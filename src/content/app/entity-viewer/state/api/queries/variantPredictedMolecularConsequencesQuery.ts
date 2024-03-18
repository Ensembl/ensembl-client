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

import type {
  VariantPredictedMolecularConsequence,
  VariantRelativeLocation
} from 'src/shared/types/variation-api/variantPredictedMolecularConsequence';

const variantRelativeLocationFragment = gql`
  fragment RelativeLocationFields on VariantRelativeLocation {
    start
    end
    length
    ref_sequence
    alt_sequence
  }
`;

export const variantPredictedMolecularConsequencesQuery = gql`
  query VariantPredictedMolecularConsequences(
    $genomeId: String!
    $variantId: String!
  ) {
    variant(by_id: { genome_id: $genomeId, variant_id: $variantId }) {
      alleles {
        predicted_molecular_consequences {
          stable_id
          gene_stable_id
          gene_symbol
          cdna_location {
            ...RelativeLocationFields
          }
          cds_location {
            ...RelativeLocationFields
          }
          protein_location {
            ...RelativeLocationFields
          }
          consequences {
            value
          }
        }
      }
    }
  }
  ${variantRelativeLocationFragment}
`;

type VariantRelativeLocationInResponse = Omit<
  VariantRelativeLocation,
  'percentage_overlap'
>;

export type PredictedMolecularConsequenceInResponse = Pick<
  VariantPredictedMolecularConsequence,
  'stable_id' | 'gene_stable_id' | 'gene_symbol' | 'consequences'
> & {
  cdna_location: VariantRelativeLocationInResponse | null;
  cds_location: VariantRelativeLocationInResponse | null;
  protein_location: VariantRelativeLocationInResponse | null;
};

type VariantAlleleInResponse = {
  urlId: string;
  predicted_molecular_consequences: PredictedMolecularConsequenceInResponse[];
};

type VariantInResponse = {
  alleles: VariantAlleleInResponse[];
};

export type VariantPredictedMolecularConsequencesResponse = {
  variant: VariantInResponse;
};
