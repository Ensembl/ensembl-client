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

import {
  createAsyncThunk,
  createSlice,
  type PayloadAction
} from '@reduxjs/toolkit';
import browserStorageService from 'src/content/app/genome-browser/services/browserStorageService';
import { updateTrackSettingsForGenome } from 'src/content/app/genome-browser/services/track-settings/trackSettingsStorageService';
import { buildDefaultRegularTrack } from 'src/content/app/genome-browser/state/track-settings/trackSettingsConstants';
import { resolveTranscriptomicTracks } from 'src/content/app/genome-browser/helpers/transcriptomic';
import type { TranscriptomicSelection } from 'src/content/app/genome-browser/state/types/transcriptomic';
import type { RootState } from 'src/store';
import type { TrackSettingsPerTrack } from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';

export const applyTranscriptomicSelections = createAsyncThunk(
  'transcriptomic/apply',
  async (
    {
      genomeId,
      selectionIds,
      selections
    }: {
      genomeId: string;
      selectionIds: string[];
      selections: TranscriptomicSelection[];
    },
    { getState }
  ) => {
    const state = getState() as RootState;
    const previousIds = state.browser.transcriptomic[genomeId] ?? [];
    const validIds = selectionIds.filter((id) =>
      selections.some((s) => s.selection_id === id)
    );
    const previous = resolveTranscriptomicTracks(selections, previousIds);
    const next = resolveTranscriptomicTracks(selections, validIds);
    const enabledIds = new Set(next.map((track) => track.track_id));
    const settings: TrackSettingsPerTrack = {};
    for (const { track_id } of [...previous, ...next]) {
      const existing =
        state.browser.trackSettings[genomeId]?.settingsForIndividualTracks[
          track_id
        ];
      const track = buildDefaultRegularTrack(track_id);
      track.settings.name = existing?.settings.name ?? track.settings.name;
      track.settings.isVisible = enabledIds.has(track_id);
      settings[track_id] = track;
    }
    await updateTrackSettingsForGenome(genomeId, Object.values(settings));
    browserStorageService.updateTranscriptomicSelections({
      [genomeId]: validIds
    });
    return { genomeId, selectionIds: validIds, settings };
  }
);

const slice = createSlice({
  name: 'transcriptomic',
  initialState: {} as Record<string, string[]>,
  reducers: {
    restoreTranscriptomicSelections(
      state,
      { payload }: PayloadAction<{ genomeId: string; selectionIds: string[] }>
    ) {
      state[payload.genomeId] ??= payload.selectionIds;
    },
    deleteTranscriptomicSelections(state, { payload }: PayloadAction<string>) {
      delete state[payload];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      applyTranscriptomicSelections.fulfilled,
      (state, { payload }) => {
        state[payload.genomeId] = payload.selectionIds;
      }
    );
  }
});
export const {
  restoreTranscriptomicSelections,
  deleteTranscriptomicSelections
} = slice.actions;
export default slice.reducer;
