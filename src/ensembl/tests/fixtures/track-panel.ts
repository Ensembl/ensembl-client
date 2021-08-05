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

import { Status } from 'src/shared/types/status';
import { BrowserTrackStates } from 'src/content/app/browser/track-panel/trackPanelConfig';
import { EnsObjectTrack } from 'src/shared/state/ens-object/ensObjectTypes';

export const createTrackStates = (): BrowserTrackStates => ({
  triticum_aestivum_GCA_900519105_1: {
    [faker.lorem.words()]: {
      [faker.lorem.words()]: Status.SELECTED,
      [faker.lorem.words()]: Status.UNSELECTED
    }
  }
});

export const createTrackInfo = (): EnsObjectTrack => ({
  additional_info: faker.lorem.words(),
  description: faker.lorem.words(),
  label: faker.lorem.words(),
  track_id: 'gene-pc-fwd',
  stable_id: faker.lorem.words()
});

export const createMainTrackInfo = (): EnsObjectTrack => ({
  additional_info: faker.lorem.words(),
  child_tracks: [
    {
      additional_info: faker.lorem.words(),
      colour: faker.lorem.words(),
      description: faker.lorem.words(),
      label: faker.lorem.words(),
      support_level: faker.lorem.words(),
      track_id: 'gene-feat-1',
      stable_id: faker.lorem.words()
    }
  ],
  description: faker.lorem.words(),
  label: faker.lorem.words(),
  track_id: 'gene-feat',
  stable_id: faker.lorem.words()
});
