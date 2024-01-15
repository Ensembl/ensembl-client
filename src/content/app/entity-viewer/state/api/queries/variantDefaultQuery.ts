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

import type { Variant } from 'src/shared/types/variation-api/variant';
import type { VariantAllele } from 'src/shared/types/variation-api/variantAllele';

export const variantDefaultQuery = gql`
  query VariantDetails($genomeId: String!, $variantId: String!) {
    variant(by_id: { genome_id: $genomeId, variant_id: $variantId }) {
      name
      alternative_names {
        name
        url
      }
      slice {
        location {
          start
          end
        }
        region {
          name
        }
      }
      allele_type {
        value
      }
      primary_source {
        url
        source {
          name
          release
        }
      }
      prediction_results {
        score
        result
        analysis_method {
          tool
        }
      }
      alleles {
        name
        allele_type {
          value
        }
        slice {
          location {
            start
            end
          }
        }
        allele_sequence
        reference_sequence
        phenotype_assertions {
          feature
        }
        prediction_results {
          score
          result
          analysis_method {
            tool
          }
        }
        population_frequencies {
          is_minor_allele
          is_hpmaf
          allele_frequency
        }
      }
    }
  }
`;

type VariantDetailsAllele = Pick<
  VariantAllele,
  'name' | 'allele_sequence' | 'reference_sequence'
> &
  Pick2<VariantAllele, 'allele_type', 'value'> &
  Pick3<VariantAllele, 'slice', 'location', 'start' | 'end'> & {
    population_frequencies: VariantDetailsAllelePopulationFrequency[];
    prediction_results: VariantDetailsAllelePredictionResult[];
    phenotype_assertions: VariantDetailsAllelePhenotypeAssertion[];
  };

type VariantDetailsAllelePopulationFrequency = Pick<
  VariantAllele['population_frequencies'][number],
  'is_minor_allele' | 'is_hpmaf' | 'allele_frequency'
>;

type VariantDetailsAllelePhenotypeAssertion = Pick<
  VariantAllele['phenotype_assertions'][number],
  'feature'
>; // it doesn't really matter what we request; the point is to check whether the array of assertions will be empty

type VariantDetailsPredictionResult = Pick<
  Variant['prediction_results'][number],
  'result' | 'score'
> &
  Pick2<Variant['prediction_results'][number], 'analysis_method', 'tool'>;

type VariantDetailsAllelePredictionResult = Pick<
  VariantAllele['prediction_results'][number],
  'result' | 'score'
> &
  Pick2<VariantAllele['prediction_results'][number], 'analysis_method', 'tool'>;

export type VariantDetails = Pick<Variant, 'name'> &
  Pick3<Variant, 'slice', 'location', 'start' | 'end'> &
  Pick3<Variant, 'slice', 'region', 'name'> &
  Pick2<Variant, 'allele_type', 'value'> &
  Pick2<Variant, 'primary_source', 'url'> &
  Pick3<Variant, 'primary_source', 'source', 'name' | 'release'> & {
    alternative_names: Pick<
      Variant['alternative_names'][number],
      'name' | 'url'
    >[];
    prediction_results: VariantDetailsPredictionResult[];
    alleles: VariantDetailsAllele[];
  };

export type EntityViewerVariantDefaultQueryResult = {
  variant: VariantDetails;
};
