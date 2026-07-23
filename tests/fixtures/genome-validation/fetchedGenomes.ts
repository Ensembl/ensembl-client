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

import { BriefGenomeSummary } from 'src/shared/state/genome/genomeTypes';

export const fetchedHuman1 = {
  genome_id: 'a7335667-93e7-11ec-a39d-005056b38ce3',
  genome_tag: 'GCA_000001405.29',
  common_name: 'Human',
  scientific_name: 'Homo sapiens',
  species_taxonomy_id: '9606',
  type: null,
  is_reference: true,
  is_suppressed: false,
  suppression_details: null,
  assembly: {
    accession_id: 'GCA_000001405.29',
    name: 'GRCh38.p14'
  },
  release: {
    name: '2025-02',
    type: 'integrated'
  },
  latest_genome: null
} satisfies BriefGenomeSummary;

export const fetchedHuman1WithLatestGenome = {
  genome_id: 'a7335667-93e7-11ec-a39d-005056b38ce3',
  genome_tag: 'GCA_000001405.29',
  common_name: 'Human',
  scientific_name: 'Homo sapiens',
  species_taxonomy_id: '9606',
  type: null,
  is_reference: true,
  is_suppressed: false,
  suppression_details: null,
  assembly: {
    accession_id: 'GCA_000001405.29',
    name: 'GRCh38.p14'
  },
  release: {
    name: '2025-02',
    type: 'integrated'
  },
  latest_genome: {
    genome_id: 'be73075e-0633-471d-b7c8-4f8ca7752a04',
    genome_tag: 'GCA_000001405.29',
    common_name: 'Human',
    scientific_name: 'Homo sapiens',
    species_taxonomy_id: '9606',
    type: null,
    is_reference: true,
    is_suppressed: false,
    suppression_details: null,
    assembly: {
      accession_id: 'GCA_000001405.29',
      name: 'GRCh38.p14'
    },
    release: {
      name: '2026-04-09',
      type: 'partial'
    }
  }
} satisfies BriefGenomeSummary;

export const fetchedHuman2 = {
  genome_id: '4c07817b-c7c5-463f-8624-982286bc4355',
  genome_tag: 'GCA_009914755.4',
  common_name: 'Human',
  scientific_name: 'Homo sapiens',
  species_taxonomy_id: '9606',
  type: null,
  is_reference: false,
  is_suppressed: false,
  suppression_details: null,
  assembly: {
    accession_id: 'GCA_009914755.4',
    name: 'T2T-CHM13v2.0'
  },
  release: {
    name: '2025-02',
    type: 'integrated'
  },
  latest_genome: null
} satisfies BriefGenomeSummary;

export const fetchedHuman3 = {
  genome_id: 'be73075e-0633-471d-b7c8-4f8ca7752a04',
  genome_tag: null,
  common_name: 'Human',
  scientific_name: 'Homo sapiens',
  species_taxonomy_id: '9606',
  type: null,
  is_reference: true,
  is_suppressed: false,
  suppression_details: null,
  assembly: {
    accession_id: 'GCA_000001405.29',
    name: 'GRCh38.p14'
  },
  release: {
    name: '2026-04-09',
    type: 'partial'
  },
  latest_genome: null
} satisfies BriefGenomeSummary;
