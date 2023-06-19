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

import type { PopularSpecies } from 'src/content/app/species-selector/types/species-search';

export const createPopularSpecies = (): PopularSpecies => ({
  genome_id: faker.string.uuid(),
  common_name: null,
  scientific_name: faker.lorem.words(),
  assembly_name: faker.lorem.word(),
  image: faker.image.url(),
  division_ids: [],
  is_available: true,
  genome_tag: null
});
