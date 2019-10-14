import faker from 'faker';

import { TrackSet } from 'src/content/app/browser/track-panel/trackPanelConfig';
import { GenomeTrackCategory } from 'src/genome/genomeTypes';

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
