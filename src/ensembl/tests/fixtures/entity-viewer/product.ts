import faker from 'faker';
import times from 'lodash/times';

import {
  ProteinDomainsResources,
  Product,
  ProductType
} from 'src/content/app/entity-viewer/types/product';

export const createProduct = (): Product => {
  const length = faker.random.number({ min: 10, max: 100 });
  const numberOfDomains = faker.random.number({ min: 1, max: 10 });
  const maxDomainLength = Math.floor(length / numberOfDomains);

  const protein_domains_resources: ProteinDomainsResources = {};

  times(numberOfDomains, (index: number) => {
    const minCoordinate = maxDomainLength * index + 1;
    const maxCoordinate = maxDomainLength * (index + 1);
    const middleCoordinate =
      maxCoordinate - (maxCoordinate - minCoordinate) / 2;
    const start = faker.random.number({
      min: minCoordinate,
      max: middleCoordinate
    });
    const end = faker.random.number({
      min: middleCoordinate + 1,
      max: maxCoordinate - 1
    });
    const resource_group_name = faker.random.words();

    protein_domains_resources[resource_group_name] = {
      name: resource_group_name,
      domains: [
        {
          name: faker.random.words(),
          source_uri: '',
          source: {
            name: faker.random.words(),
            uri: ''
          },
          location: {
            start: start,
            end: end
          },
          score: faker.random.number()
        }
      ]
    };
  });

  return {
    stable_id: faker.random.words(),
    type: ProductType.PROTEIN,
    length: length,
    protein_domains_resources: protein_domains_resources
  };
};
