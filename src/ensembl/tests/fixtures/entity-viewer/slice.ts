import faker from 'faker';

import { Slice } from 'src/content/app/entity-viewer/types/slice';
import { Strand } from 'src/content/app/entity-viewer/types/strand';

export const createSlice = (): Slice => {
  const start = faker.random.number({ min: 1, max: 1000000 });
  const end =
    start + faker.random.number({ min: start + 100, max: start + 10000 });

  return {
    location: {
      start,
      end
    },
    region: {
      name: faker.lorem.word(),
      strand: {
        code: faker.random.boolean() ? Strand.FORWARD : Strand.REFVERSE
      }
    }
  };
};
