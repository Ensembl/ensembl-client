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

import type { PopularSpecies } from 'src/content/app/new-species-selector/types/popularSpecies';
import type { SpeciesSearchMatch } from 'src/content/app/new-species-selector/types/speciesSearchMatch';

export const popularSpecies: PopularSpecies[] = [
  {
    id: 1,
    name: 'Human',
    image:
      'https://staging-2020.ensembl.org/static/genome_images/homo_sapiens_GCA_000001405_14.svg', // TODO: change this to updated human image
    members_count: 2,
    is_selected: false
  }
];

export const humanSearchMatches: SpeciesSearchMatch[] = [
  {
    genome_id: 'a7335667-93e7-11ec-a39d-005056b38ce3',
    genome_tag: 'grch38',
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    type: null,
    is_reference: true,
    assembly: {
      accession_id: 'GCA_000001405.28',
      name: 'GRCh38.p13',
      url: 'https://www.ebi.ac.uk/ena/data/view/GCA_000001405.28'
    },
    coding_genes_count: 20446,
    contig_n50: 56413054,
    has_variation: true,
    has_regulation: true,
    annotation_provider: 'Ensembl',
    annotation_method: 'Full genebuild',
    rank: 1
  },
  {
    genome_id: '704ceb1-948d-11ec-a39d-005056b38ce3',
    genome_tag: 'grch37',
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    type: null,
    is_reference: false,
    assembly: {
      accession_id: 'GCA_000001405.14',
      name: 'GRCh37.p13',
      url: 'https://www.ebi.ac.uk/ena/browser/view/GCA_000001405.14'
    },
    coding_genes_count: 20787,
    contig_n50: 38440852,
    has_variation: true,
    has_regulation: true,
    annotation_provider: 'Ensembl',
    annotation_method: 'Full genebuild',
    rank: 2
  }
];
