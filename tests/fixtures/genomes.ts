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

import { TrackSet } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import { GenomeKaryotypeItemType } from 'src/shared/state/genome/genomeTypes';
import type {
  GenomeTrackCategory,
  GenomicTrack
} from 'src/content/app/genome-browser/state/types/tracks';

export const createGenomeCategories = (): GenomeTrackCategory[] => [
  {
    label: faker.lorem.words() as string,
    track_category_id: faker.lorem.words(),
    track_list: [createTrack()],
    type: TrackSet.GENOMIC
  },
  {
    label: faker.lorem.words(),
    track_category_id: faker.lorem.words(),
    track_list: [createTrack()],
    type: TrackSet.VARIATION
  },
  {
    label: faker.lorem.words(),
    track_category_id: faker.lorem.words(),
    track_list: [],
    type: TrackSet.REGULATION
  }
];

const createTrack = (): GenomicTrack => {
  return {
    track_id: 'gene-pc-fwd',
    trigger: ['track', 'gene-pc-fwd'],
    type: 'gene',
    additional_info: faker.lorem.words(),
    colour: 'DARK_GREY',
    label: faker.lorem.words(),
    on_by_default: true,
    display_order: 1,
    description: faker.lorem.sentence(),
    sources: [
      {
        name: faker.lorem.word(),
        url: faker.internet.url()
      }
    ]
  };
};
export const createGenomeKaryotype = () =>
  times(25, () => ({
    is_chromosome: true,
    is_circular: false,
    length: faker.number.int(),
    name: faker.lorem.words(),
    type: GenomeKaryotypeItemType.CHROMOSOME
  }));
