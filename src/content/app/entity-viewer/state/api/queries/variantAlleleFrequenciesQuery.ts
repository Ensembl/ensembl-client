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

import type { VariantAllelePopulationFrequency } from 'src/shared/types/variation-api/variantAllelePopulationFrequency';

// FIXME: remove allele_type.value when injection of mock data is no longer necessary
export const variantAlleleFrequenciesQuery = gql`
  query VariantAlleleFrequencies($genomeId: String!, $variantId: String!) {
    variant(by_id: { genome_id: $genomeId, variant_id: $variantId }) {
      alleles {
        allele_type {
          value
        }
        population_frequencies {
          population_name
          allele_frequency
        }
      }
    }
  }
`;

type PopulationFrequencyProperties = 'population_name' | 'allele_frequency';

type PopulationFrequencyInResponse = Pick<
  VariantAllelePopulationFrequency,
  PopulationFrequencyProperties
>;

export type VariantAlleleInResponse = {
  urlId: string;
  population_frequencies: PopulationFrequencyInResponse[];
};

export type VariantInResponse = {
  alleles: VariantAlleleInResponse[];
};

export type VariantAlleleFrequenciesQueryResult = {
  variant: VariantInResponse;
};
