import faker from 'faker';

import { EnsObject } from 'src/ens-object/ensObjectTypes';

export const createEnsObject = (): EnsObject => ({
  bio_type: faker.lorem.words(),
  label: faker.lorem.word(),
  object_id: faker.lorem.word(),
  genome_id: faker.lorem.word(),
  location: createLocation(),
  object_type: 'gene',
  stable_id: faker.lorem.word(),
  strand: 'forward',
  description: faker.lorem.words(),
  track: createTrackInfo()
});

const createLocation = () => {
  const startPosition = faker.random.number(10000);
  const endPosition = startPosition + faker.random.number(10000);

  return {
    chromosome: String(faker.random.number(30)),
    start: startPosition,
    end: endPosition
  };
};

const createTrackInfo = () => ({
  label: faker.lorem.word(),
  object_id: faker.lorem.word(),
  support_level: null,
  track_id: faker.lorem.word(),
  description: null
});
