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

import type { VariantStudyPopulation } from 'src/shared/types/variation-api/variantStudyPopulation';

export const variantStudyPopulationsQuery = gql`
  query VariantStudyPopulations($genomeId: String!) {
    populations(genome_id: $genomeId) {
      name
      description
      is_global
      display_group_name
    }
  }
`;

// type PopulationNameOnly = Pick<VariantStudyPopulation, 'name'>;

type PopulationInResponse = Omit<
  VariantStudyPopulation,
  'super_population' | 'sub_populations'
>;

/**
  & {
    super_population: PopulationNameOnly | null;
    sub_populations: PopulationNameOnly[];
  }
 */

export type VariantStudyPopulationsQueryResult = {
  populations: PopulationInResponse[];
};
