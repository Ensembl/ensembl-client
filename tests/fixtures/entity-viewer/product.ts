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
import times from 'lodash/times';

import { createExternalReference } from './external-reference';

import {
  Product,
  ProductType,
  FamilyMatch
} from 'src/shared/types/core-api/product';

export const createProduct = (fragment: Partial<Product> = {}): Product => {
  const length = fragment?.length || faker.number.int({ min: 50, max: 100 });
  const unversionedStableId = faker.string.uuid();
  const version = 1;
  const stableId = `${unversionedStableId}.${version}`;

  return {
    type: ProductType.PROTEIN,
    stable_id: stableId,
    unversioned_stable_id: unversionedStableId,
    version,
    length: length,
    family_matches: createFamilyMatches(length),
    external_references: times(2, () => createExternalReference()),
    sequence: {
      checksum: faker.string.uuid()
    },
    ...fragment
  };
};

const createFamilyMatches = (proteinLength: number): FamilyMatch[] => {
  const numberOfDomains = faker.number.int({ min: 1, max: 10 });
  const maxDomainLength = Math.floor(proteinLength / numberOfDomains);

  return times(numberOfDomains, (index: number) => {
    const minCoordinate = maxDomainLength * index + 1;
    const maxCoordinate = maxDomainLength * (index + 1);
    const middleCoordinate = Math.floor(
      maxCoordinate - (maxCoordinate - minCoordinate) / 2
    );
    const start = faker.number.int({
      min: minCoordinate,
      max: middleCoordinate
    });
    const end = faker.number.int({
      min: middleCoordinate + 1,
      max: maxCoordinate - 1
    });
    const length = end - start + 1;

    return {
      relative_location: {
        start,
        end,
        length
      },
      sequence_family: {
        name: faker.lorem.words(),
        description: faker.lorem.words(),
        url: faker.internet.url(),
        source: {
          id: faker.string.uuid(),
          name: faker.lorem.word(),
          url: faker.internet.url()
        }
      },
      via: null
    };
  });
};
