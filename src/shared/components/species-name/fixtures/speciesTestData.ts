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

export const humanGenome = {
  genome_id: 'homo_sapiens38',
  common_name: 'Human',
  scientific_name: 'Homo sapiens',
  species_taxonomy_id: '1',
  is_reference: true,
  type: {
    kind: 'population',
    value: 'African Caribbean in Barbados'
  },
  assembly: {
    accession_id: 'GCA_000001405.29',
    name: 'GRCh38'
  },
  release: {
    name: '2023-10-18',
    type: 'partial'
  },
  genome_tag: 'grch38',
  isEnabled: true,
  addedAt: Date.now()
} satisfies CommittedItem;
