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

import { faker } from '@faker-js/faker';

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

export const createSelectedSpecies = (
  fragment: Partial<CommittedItem> = {}
): CommittedItem => ({
  genome_id: faker.string.uuid(),
  genome_tag: null,
  common_name: null,
  scientific_name: faker.lorem.words(),
  species_taxonomy_id: faker.lorem.word(),
  type: null,
  is_reference: true,
  assembly: {
    accession_id: faker.lorem.word(),
    name: faker.lorem.word()
  },
  release: {
    name: '2025-02',
    type: 'integrated'
  },
  isEnabled: true,
  addedAt: Date.now(),
  ...fragment
});
