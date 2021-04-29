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

import { TrackSet } from 'src/content/app/browser/track-panel/trackPanelConfig';
import {
  GenomeTrackCategory,
  GenomeKaryotypeItemType
} from 'src/shared/state/genome/genomeTypes';

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
        track_id: faker.lorem.words(),
        stable_id: faker.lorem.words()
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
    length: faker.datatype.number(),
    name: faker.lorem.words(),
    type: GenomeKaryotypeItemType.CHROMOSOME
  }));
