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

import faker from '@faker-js/faker';
import merge from 'lodash/merge';

import { ExternalReference } from 'src/shared/types/thoas/externalReference';

export const createExternalReference = (
  fragment?: Partial<
    Omit<ExternalReference, 'source'> & {
      source: Partial<ExternalReference['source']>;
    }
  >
): ExternalReference => {
  const xref = {
    accession_id: faker.lorem.word(),
    name: faker.lorem.word(),
    description: faker.lorem.word(),
    url: faker.lorem.word(),
    source: {
      name: faker.lorem.word(),
      id: faker.lorem.word(),
      url: faker.lorem.word()
    }
  };

  return merge(xref, fragment);
};
