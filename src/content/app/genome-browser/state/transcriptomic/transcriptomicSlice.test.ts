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

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import transcriptomic, {
  applyTranscriptomicSelections,
  restoreTranscriptomicSelections
} from './transcriptomicSlice';
import trackSettings, {
  updateTrackVisibilityAndSave
} from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';
import browserStorageService from 'src/content/app/genome-browser/services/browserStorageService';
import { updateTrackSettingsForGenome } from 'src/content/app/genome-browser/services/track-settings/trackSettingsStorageService';
import {
  createTranscriptomicConfiguration,
  genomeId,
  otherGenomeId,
  liverRunA,
  liverRunB
} from 'tests/fixtures/transcriptomic';

// IndexedDB serialization has its own service tests. Here we test the state/storage boundary.
vi.mock(
  'src/content/app/genome-browser/services/track-settings/trackSettingsStorageService',
  () => ({
    updateTrackSettingsForGenome: vi.fn().mockResolvedValue(undefined),
    updateTrackSettings: vi.fn().mockResolvedValue(undefined)
  })
);

const createStore = () =>
  configureStore({
    reducer: { browser: combineReducers({ transcriptomic, trackSettings }) }
  });
const selections = createTranscriptomicConfiguration().selections;
const trackA = liverRunA.track_products[0].track_id;
const trackB = liverRunB.track_products[0].track_id;

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
afterEach(() => vi.restoreAllMocks());

describe('applyTranscriptomicSelections', () => {
  it('initializes UUID-based settings and persists only known selections', async () => {
    const store = createStore();
    await store
      .dispatch(
        applyTranscriptomicSelections({
          genomeId,
          selections,
          selectionIds: [liverRunA.selection_id, 'unknown-run']
        })
      )
      .unwrap();

    expect(store.getState().browser.transcriptomic[genomeId]).toEqual([
      liverRunA.selection_id
    ]);
    expect(
      browserStorageService.getTranscriptomicSelections()[genomeId]
    ).toEqual([liverRunA.selection_id]);
    expect(updateTrackSettingsForGenome).toHaveBeenCalledWith(genomeId, [
      expect.objectContaining({
        id: trackA,
        settings: expect.objectContaining({ isVisible: true })
      })
    ]);
  });

  it.each([
    {
      label: 'one removed run',
      nextIds: [liverRunB.selection_id],
      bVisible: true
    },
    { label: 'an empty selection', nextIds: [], bVisible: false }
  ])('disables previous tracks for $label', async ({ nextIds, bVisible }) => {
    const store = createStore();
    await store
      .dispatch(
        applyTranscriptomicSelections({
          genomeId,
          selections,
          selectionIds: [liverRunA.selection_id, liverRunB.selection_id]
        })
      )
      .unwrap();
    await store
      .dispatch(
        applyTranscriptomicSelections({
          genomeId,
          selections,
          selectionIds: nextIds
        })
      )
      .unwrap();

    const settings =
      store.getState().browser.trackSettings[genomeId]
        .settingsForIndividualTracks;
    expect(settings[trackA].settings).toMatchObject({ isVisible: false });
    expect(settings[trackB].settings).toMatchObject({ isVisible: bVisible });
    expect(
      browserStorageService.getTranscriptomicSelections()[genomeId]
    ).toEqual(nextIds);
  });

  it('keeps individually hidden runs configured and re-enables them on Apply', async () => {
    const store = createStore();
    const selectionIds = [liverRunA.selection_id];
    await store
      .dispatch(
        applyTranscriptomicSelections({ genomeId, selections, selectionIds })
      )
      .unwrap();
    await store
      .dispatch(
        updateTrackVisibilityAndSave({
          genomeId,
          trackId: trackA,
          isVisible: false
        })
      )
      .unwrap();
    expect(store.getState().browser.transcriptomic[genomeId]).toEqual(
      selectionIds
    );
    expect(
      store.getState().browser.trackSettings[genomeId]
        .settingsForIndividualTracks[trackA].settings
    ).toMatchObject({ isVisible: false });

    await store
      .dispatch(
        applyTranscriptomicSelections({ genomeId, selections, selectionIds })
      )
      .unwrap();
    expect(
      store.getState().browser.trackSettings[genomeId]
        .settingsForIndividualTracks[trackA].settings
    ).toMatchObject({ isVisible: true });
  });

  it('restores membership per genome without replacing another genome', async () => {
    const store = createStore();
    await store
      .dispatch(
        applyTranscriptomicSelections({
          genomeId,
          selections,
          selectionIds: [liverRunA.selection_id]
        })
      )
      .unwrap();
    await store
      .dispatch(
        applyTranscriptomicSelections({
          genomeId: otherGenomeId,
          selections,
          selectionIds: [liverRunB.selection_id]
        })
      )
      .unwrap();
    const saved = browserStorageService.getTranscriptomicSelections();
    const restored = createStore();
    for (const [genomeId, selectionIds] of Object.entries(saved)) {
      restored.dispatch(
        restoreTranscriptomicSelections({ genomeId, selectionIds })
      );
    }
    expect(restored.getState().browser.transcriptomic).toEqual({
      [genomeId]: [liverRunA.selection_id],
      [otherGenomeId]: [liverRunB.selection_id]
    });
  });

  it('retains applied state when saving membership fails', async () => {
    const store = createStore();
    await store
      .dispatch(
        applyTranscriptomicSelections({
          genomeId,
          selections,
          selectionIds: [liverRunA.selection_id]
        })
      )
      .unwrap();
    vi.spyOn(
      browserStorageService,
      'updateTranscriptomicSelections'
    ).mockImplementationOnce(() => {
      throw new Error('Storage unavailable');
    });
    const result = await store.dispatch(
      applyTranscriptomicSelections({
        genomeId,
        selections,
        selectionIds: [liverRunB.selection_id]
      })
    );
    expect(applyTranscriptomicSelections.rejected.match(result)).toBe(true);
    expect(store.getState().browser.transcriptomic[genomeId]).toEqual([
      liverRunA.selection_id
    ]);
  });
});
