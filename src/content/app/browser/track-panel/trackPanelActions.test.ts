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

import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import faker from 'faker';

import browserStorageService from 'src/content/app/browser/browser-storage-service';

import * as trackPanelActions from './trackPanelActions';
import {
  pickPersistentTrackPanelProperties,
  TrackPanelStateForGenome
} from './trackPanelState';
import { TrackSet } from './trackPanelConfig';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const trackPanelProperties: TrackPanelStateForGenome = {
  isTrackPanelModalOpened: faker.datatype.boolean(),
  selectedTrackPanelTab: TrackSet.GENOMIC,
  trackPanelModalView: faker.lorem.word(),
  highlightedTrackId: faker.lorem.word(),
  isTrackPanelOpened: faker.datatype.boolean(),
  collapsedTrackIds: [faker.lorem.word()],
  bookmarks: [],
  previouslyViewedObjects: []
};

describe('track panel actions', () => {
  beforeEach(() => {
    jest.spyOn(browserStorageService, 'updateTrackPanels');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('updateTrackPanelForGenome', () => {
    it('saves a subset of track panel properties every time it‘s called', () => {
      const store = mockStore({});
      const genomeId = faker.random.word();

      store.dispatch(
        trackPanelActions.updateTrackPanelForGenome({
          activeGenomeId: genomeId,
          data: trackPanelProperties
        })
      );

      expect(browserStorageService.updateTrackPanels).toHaveBeenCalledTimes(1);

      const storedPayload = (browserStorageService.updateTrackPanels as any)
        .mock.calls[0][0];
      const storedData = storedPayload[genomeId];

      const allowedProperties = pickPersistentTrackPanelProperties(
        trackPanelProperties
      );
      expect(storedData).toEqual(allowedProperties);
    });
  });
});
