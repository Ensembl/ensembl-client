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

import type { GeneHomology } from '../types/geneHomology';

export const geneHomologiesQuery = gql`
  query EntityViewerGeneHomologies($genomeId: String!, $geneId: String!) {
    homologies(genome_id: $genomeId, gene_stable_id: $geneId) {
      target_genome {
        genome_id
        common_name
        scientific_name
        assembly {
          accession_id
          name
        }
      }
      target_gene {
        stable_id
        symbol
        version
        unversioned_stable_id
      }
      query_genome {
        genome_id
        common_name
        scientific_name
        assembly {
          accession_id
          name
        }
      }
      query_gene {
        stable_id
        symbol
        version
        unversioned_stable_id
      }
      subtype {
        accession_id
        label
        value
        definition
      }
      stats {
        query_percent_id
        query_percent_coverage
        target_percent_id
        target_percent_coverage
      }
    }
  }
`;

/**
 * When the `homologies` field is null, it means that compara pipelines
 * have not been run for the current genome.
 * Note that this is different from the scenario in which the pipelines were run,
 * but no homologies were found. In that case, the homologies field will resolve to an empty array.
 */
export type EntityViewerGeneHomologiesQueryResult = {
  homologies: GeneHomology[] | null;
};
