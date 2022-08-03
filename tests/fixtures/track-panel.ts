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

import { Status } from 'src/shared/types/status';
import { BrowserTrackStates } from 'src/content/app/genome-browser/components/track-panel/trackPanelConfig';
import type { GenomicTrack } from 'src/content/app/genome-browser/state/types/tracks';

export const createTrackStates = (): BrowserTrackStates => ({
  fake_genome_id_1: {
    [faker.lorem.words()]: {
      [faker.lorem.words()]: Status.SELECTED,
      [faker.lorem.words()]: Status.UNSELECTED
    }
  }
});

export const createTrackInfo = (): GenomicTrack => ({
  colour: 'GREY',
  additional_info: faker.lorem.words(),
  label: faker.lorem.words(),
  track_id: 'gene-pc-fwd'
});
