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

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

// Reference assembly, integrated release
export const human1 = {
  genome_id: 'a7335667-93e7-11ec-a39d-005056b38ce3',
  genome_tag: 'GCA_000001405.29',
  common_name: 'Human',
  scientific_name: 'Homo sapiens',
  species_taxonomy_id: '9606',
  assembly: {
    accession_id: 'GCA_000001405.29',
    name: 'GRCh38.p14'
  },
  release: {
    name: '2025-02',
    type: 'integrated'
  },
  is_reference: true,
  type: null,
  isEnabled: true,
  addedAt: 1782913507952
} satisfies CommittedItem;

// Non-reference assembly; integrated release
export const human2 = {
  genome_id: '4c07817b-c7c5-463f-8624-982286bc4355',
  genome_tag: 'GCA_009914755.4',
  common_name: 'Human',
  scientific_name: 'Homo sapiens',
  species_taxonomy_id: '9606',
  assembly: {
    accession_id: 'GCA_009914755.4',
    name: 'T2T-CHM13v2.0'
  },
  release: {
    name: '2025-02',
    type: 'integrated'
  },
  is_reference: false,
  type: null,
  isEnabled: true,
  addedAt: 1783579982976
} satisfies CommittedItem;

// Non-reference assembly, partial release
export const human3 = {
  genome_id: 'be73075e-0633-471d-b7c8-4f8ca7752a04',
  genome_tag: null,
  common_name: 'Human',
  scientific_name: 'Homo sapiens',
  species_taxonomy_id: '9606',
  assembly: {
    accession_id: 'GCA_000001405.29',
    name: 'GRCh38.p14'
  },
  release: {
    name: '2026-04-09',
    type: 'partial'
  },
  is_reference: true,
  type: null,
  isEnabled: true,
  addedAt: 1783949369729
} satisfies CommittedItem;
