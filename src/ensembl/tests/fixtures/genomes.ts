import faker from 'faker';
import times from 'lodash/times';

import { TrackSet } from 'src/content/app/browser/track-panel/trackPanelConfig';
import {
  GenomeTrackCategory,
  GenomeKaryotypeItemType
} from 'src/genome/genomeTypes';

export const createGenomeCategories = (): GenomeTrackCategory[] => [
  {
    label: faker.lorem.words() as string,
    track_category_id: faker.lorem.words(),
    track_list: [],
    types: [TrackSet.GENOMIC]
  },
  {
    label: faker.lorem.words(),
    track_category_id: faker.lorem.words(),
    track_list: [
      {
        description: faker.lorem.words(),
        label: faker.lorem.words(),
        track_id: faker.lorem.words()
      }
    ],
    types: [TrackSet.VARIATION]
  },
  {
    label: faker.lorem.words(),
    track_category_id: faker.lorem.words(),
    track_list: [],
    types: [TrackSet.EXPRESSION]
  }
];

export const createGenomeKaryotype = () =>
  times(25, () => ({
    is_chromosome: true,
    is_circular: false,
    length: faker.random.number(),
    name: faker.lorem.words(),
    type: GenomeKaryotypeItemType.CHROMOSOME
  }));
