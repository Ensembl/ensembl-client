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

import { Slice } from 'src/shared/types/thoas/slice';
import { Strand } from 'src/shared/types/thoas/strand';

export const createSlice = (): Slice => {
  const start = faker.number.int({ min: 1, max: 1000000 });
  const end =
    start + faker.number.int({ min: start + 100, max: start + 10000 });
  const length = end - start + 1;

  return {
    location: {
      start,
      end,
      length
    },
    strand: {
      code: Strand.FORWARD
    },
    region: {
      name: faker.lorem.word(),
      length: length * 100,
      topology: 'linear',
      code: 'chromosome',
      assembly: faker.string.uuid(),
      sequence: {
        checksum: faker.string.uuid()
      }
    }
  };
};
