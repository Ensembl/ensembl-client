import faker from 'faker';

import {
  EnsObject,
  EnsObjectType
} from 'src/shared/state/ens-object/ensObjectTypes';
import { Strand } from 'src/content/app/entity-viewer/types/strand';

export const createEnsObject = (objectType?: EnsObjectType): EnsObject => {
  const genome_id = faker.lorem.word();
  const type = objectType || 'gene';
  const object_id = `${genome_id}:${objectType}:${faker.random.uuid()};`;
  return {
    bio_type: faker.lorem.words(),
    label: faker.lorem.word(),
    object_id,
    genome_id,
    location: createLocation(),
    type,
    stable_id: faker.lorem.word(),
    versioned_stable_id: faker.lorem.word(),
    strand: Strand.FORWARD,
    description: faker.lorem.words(),
    track: createTrackInfo()
  };
};

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
