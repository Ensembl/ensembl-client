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

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { TranscriptView } from 'src/content/app/sequence-viewer/types/transcriptView';

type GeneSequenceLineNumbering = 'region' | 'gene';

export type TranscriptSequenceLineNumbering =
  'region' | 'gene' | 'transcript' | 'cdna' | 'cds';

type TranscriptSequenceSettings = {
  type: 'transcript';
  view: TranscriptView;
  lineNumbering: TranscriptSequenceLineNumbering | null;
  upstreamFlankingSequenceLength: number;
  downstreamFlankingSequenceLength: number;
};

type GeneSequenceSettings = {
  type: 'gene';
  lineNumbering: GeneSequenceLineNumbering | null;
  upstreamFlandingSequenceLength: number;
  downstreamFlandingSequenceLength: number;
};

const initialTranscriptSequenceSettings: TranscriptSequenceSettings = {
  type: 'transcript',
  view: 'genomic',
  lineNumbering: null,
  upstreamFlankingSequenceLength: 0,
  downstreamFlankingSequenceLength: 0
};

const initialGeneSequenceSettings: GeneSequenceSettings = {
  type: 'gene',
  lineNumbering: null,
  upstreamFlandingSequenceLength: 0,
  downstreamFlandingSequenceLength: 0
};

const initialState = {
  geneSequenceSettings: initialGeneSequenceSettings,
  transcriptSequenceSettings: initialTranscriptSequenceSettings
};

const settingsSlice = createSlice({
  name: 'sequence-viewer-settings',
  initialState,
  reducers: {
    changeTranscriptSequenceSettings(
      state,
      action: PayloadAction<Partial<TranscriptSequenceSettings>>
    ) {
      const fragment = action.payload;
      Object.assign(state.transcriptSequenceSettings, fragment);
    },
    changeGeneSequenceSettings(
      state,
      action: PayloadAction<Partial<GeneSequenceSettings>>
    ) {
      const fragment = action.payload;
      Object.assign(state.transcriptSequenceSettings, fragment);
    }
  }
});

export const { changeGeneSequenceSettings, changeTranscriptSequenceSettings } =
  settingsSlice.actions;

export default settingsSlice.reducer;
