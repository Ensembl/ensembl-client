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
import times from 'lodash/times';
import merge from 'lodash/merge';

import {
  ProteinDomain,
  Product,
  ProductType
} from 'src/shared/types/thoas/product';

import { ExternalReference } from 'src/shared/types/thoas/externalReference';

export const createProduct = (fragment: Partial<Product> = {}): Product => {
  const length =
    fragment?.length || faker.datatype.number({ min: 10, max: 100 });
  const unversionedStableId = faker.datatype.uuid();
  const version = 1;
  const stableId = `${unversionedStableId}.${version}`;

  return {
    type: ProductType.PROTEIN,
    stable_id: stableId,
    unversioned_stable_id: unversionedStableId,
    version,
    so_term: faker.lorem.word(),
    length: length,
    protein_domains: createProteinDomains(length),
    external_references: times(2, () => createExternalReference()),
    ...fragment
  };
};

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

const createProteinDomains = (proteinLength: number): ProteinDomain[] => {
  const numberOfDomains = faker.datatype.number({ min: 1, max: 10 });
  const maxDomainLength = Math.floor(proteinLength / numberOfDomains);

  return times(numberOfDomains, (index: number) => {
    const minCoordinate = maxDomainLength * index + 1;
    const maxCoordinate = maxDomainLength * (index + 1);
    const middleCoordinate =
      maxCoordinate - (maxCoordinate - minCoordinate) / 2;
    const start = faker.datatype.number({
      min: minCoordinate,
      max: middleCoordinate
    });
    const end = faker.datatype.number({
      min: middleCoordinate + 1,
      max: maxCoordinate - 1
    });

    return {
      id: faker.datatype.uuid(),
      name: faker.random.words(),
      resource_name: faker.random.word(),
      location: {
        start,
        end,
        length: end - start + 1
      }
    };
  });
};
