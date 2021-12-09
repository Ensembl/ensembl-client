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

import faker from 'faker';

import {
  FocusObject,
  FocusObjectType
} from 'src/content/app/genome-browser/state/focus-object/focusObjectTypes';
import { Strand } from 'src/shared/types/thoas/strand';

export const createFocusObject = (
  objectType?: FocusObjectType
): FocusObject => {
  const genome_id = faker.lorem.word();
  const type = objectType || 'gene';
  const object_id = `${genome_id}:${objectType}:${faker.datatype.uuid()};`;

  return {
    bio_type: faker.lorem.words(),
    label: faker.lorem.word(),
    object_id,
    genome_id,
    location: createLocation(),
    type,
    stable_id: faker.lorem.word(),
    versioned_stable_id: faker.lorem.word(),
    strand: Strand.FORWARD
  };
};

const createLocation = () => {
  const startPosition = faker.datatype.number(10000);
  const endPosition = startPosition + faker.datatype.number(10000);

  return {
    chromosome: String(faker.datatype.number(30)),
    start: startPosition,
    end: endPosition
  };
};
