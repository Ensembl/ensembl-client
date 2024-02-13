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
import type { VariantPredictedMolecularConsequence } from 'src/shared/types/variation-api/variantPredictedMolecularConsequence';

export const variantTranscriptConsequencesQuery = gql`
  query VariantTranscriptConsequence($genomeId: String!, $variantId: String!) {
    variant(by_id: { genome_id: $genomeId, variant_id: $variantId }) {
      alleles {
        allele_sequence
        predicted_molecular_consequences {
          consequences {
            accession_id
          }
          feature_stable_id
        }
      }
    }
  }
`;

type PredictedMolecularConsequence = {
  urlId: string;
  allele_sequence: string;
  predicted_molecular_consequences: VariantPredictedMolecularConsequence[];
};
export type VariantTranscriptConsequencesQueryResult = {
  variant: {
    alleles: PredictedMolecularConsequence[];
  };
};
