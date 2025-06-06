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

import type { GenomeInfo } from 'src/shared/state/genome/genomeTypes';

type SearchMatchFieldsFromGenomeInfo =
  | 'genome_id'
  | 'genome_tag'
  | 'common_name'
  | 'scientific_name'
  | 'species_taxonomy_id'
  | 'type'
  | 'is_reference'
  | 'assembly'
  | 'release';

export type SpeciesSearchMatch = Pick<
  GenomeInfo,
  SearchMatchFieldsFromGenomeInfo
> & {
  coding_genes_count: number;
  contig_n50: number | null; // E.coli doesn't have contig n50 in species stats
  has_variation: boolean;
  has_regulation: boolean;
  annotation_provider: string;
  annotation_method: string;
  rank: number | null; // <-- to know that some matches are more important than others and should be put on top
};
