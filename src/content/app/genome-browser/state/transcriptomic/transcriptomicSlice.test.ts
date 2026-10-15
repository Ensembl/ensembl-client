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

import 'fake-indexeddb/auto';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import transcriptomic, {
  applyTranscriptomicSelections,
  restoreTranscriptomicSelections
} from './transcriptomicSlice';
import trackSettings, {
  updateTrackVisibilityAndSave
} from '../track-settings/trackSettingsSlice';
import { openDB } from 'idb';
import IndexedDB from 'src/services/indexeddb-service';
import { GB_TRACK_SETTINGS_STORE_NAME } from '../../services/track-settings/trackSettingsStorageConstants';
import browserStorageService from '../../services/browserStorageService';
import { getTrackSettingsForGenome } from '../../services/track-settings/trackSettingsStorageService';
import type { TranscriptomicSelection } from '../types/transcriptomic';

const selections: TranscriptomicSelection[] = ['a', 'b'].map((id) => ({
  selection_id: id,
  display_label: id,
  selection_level: 'run',
  data_type: 'rnaseq',
  metadata: {},
  track_products: [{ track_id: `track-${id}`, track_type: 'coverage' }]
}));

const makeStore = () =>
  configureStore({
    reducer: { browser: combineReducers({ transcriptomic, trackSettings }) }
  });

vi.spyOn(IndexedDB, 'getDB').mockImplementation(() =>
  openDB('transcriptomic-test', 1, {
    upgrade(db) {
      const store = db.createObjectStore(GB_TRACK_SETTINGS_STORE_NAME, {
        keyPath: ['genomeId', 'trackId']
      });
      store.createIndex('genomeId', 'genomeId');
    }
  })
);
beforeEach(async () => {
  localStorage.clear();
  await IndexedDB.clear(GB_TRACK_SETTINGS_STORE_NAME);
});

it('applies all selected products, preserves disabled membership, re-enables on Apply, and removes unchecked tracks', async () => {
  const store = makeStore();
  await store.dispatch(
    applyTranscriptomicSelections({
      genomeId: 'pig',
      selectionIds: ['a', 'b'],
      selections
    })
  );
  await store.dispatch(
    updateTrackVisibilityAndSave({
      genomeId: 'pig',
      trackId: 'track-a',
      isVisible: false
    })
  );
  expect(store.getState().browser.transcriptomic.pig).toEqual(['a', 'b']);
  expect(
    store.getState().browser.trackSettings.pig.settingsForIndividualTracks[
      'track-a'
    ].settings
  ).toMatchObject({ isVisible: false });
  await store.dispatch(
    applyTranscriptomicSelections({
      genomeId: 'pig',
      selectionIds: ['a'],
      selections
    })
  );
  expect(
    store.getState().browser.trackSettings.pig.settingsForIndividualTracks[
      'track-a'
    ].settings
  ).toMatchObject({ isVisible: true });
  expect(
    store.getState().browser.trackSettings.pig.settingsForIndividualTracks[
      'track-b'
    ].settings
  ).toMatchObject({ isVisible: false });
  await store.dispatch(
    applyTranscriptomicSelections({
      genomeId: 'pig',
      selectionIds: [],
      selections
    })
  );
  expect(store.getState().browser.transcriptomic.pig).toEqual([]);
  expect(
    store.getState().browser.trackSettings.pig.settingsForIndividualTracks[
      'track-a'
    ].settings
  ).toMatchObject({ isVisible: false });
});

it('restores membership separately from saved visibility and isolates genomes', async () => {
  const store = makeStore();
  await store.dispatch(
    applyTranscriptomicSelections({
      genomeId: 'pig',
      selectionIds: ['a'],
      selections
    })
  );
  await store.dispatch(
    updateTrackVisibilityAndSave({
      genomeId: 'pig',
      trackId: 'track-a',
      isVisible: false
    })
  );
  await store.dispatch(
    applyTranscriptomicSelections({
      genomeId: 'other',
      selectionIds: ['b'],
      selections
    })
  );
  const restored = makeStore();
  restored.dispatch(
    restoreTranscriptomicSelections({
      genomeId: 'pig',
      selectionIds: browserStorageService.getTranscriptomicSelections().pig
    })
  );
  expect(restored.getState().browser.transcriptomic.pig).toEqual(['a']);
  expect(browserStorageService.getTranscriptomicSelections().other).toEqual([
    'b'
  ]);
  expect(
    (await getTrackSettingsForGenome('pig')).find(
      (t) => t.trackId === 'track-a'
    )?.settings.isVisible
  ).toBe(false);
});
