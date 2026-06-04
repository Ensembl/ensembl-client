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

const viewNames = ['transcript', 'protein', 'exons'] as const;

export type ViewName = (typeof viewNames)[number];

export const defaultView = 'transcript';

export const isValidView = (view: string) =>
  (viewNames as readonly string[]).includes(view);

export type StateForTranscript = {
  view: ViewName;
};

type State = {
  [genomeId: string]: {
    [transcriptId: string]: StateForTranscript;
  };
};

const initialStateForTranscript: StateForTranscript = {
  view: 'transcript'
};

const ensureTranscriptState = (
  state: State,
  genomeId: string,
  transcriptId: string
) => {
  if (!state[genomeId]) {
    state[genomeId] = {};
  }
  if (!state[genomeId][transcriptId]) {
    state[genomeId][transcriptId] = structuredClone(initialStateForTranscript);
  }
};

const transcriptViewGeneralSlice = createSlice({
  name: 'entity-viewer-transcript-view-general',
  initialState: {} as State,
  reducers: {
    setView(
      state,
      action: PayloadAction<{
        genomeId: string;
        transcriptId: string;
        view: ViewName;
      }>
    ) {
      const { genomeId, transcriptId, view } = action.payload;
      ensureTranscriptState(state, genomeId, transcriptId);
      state[genomeId][transcriptId].view = view;
    }
  }
});

export const { setView } = transcriptViewGeneralSlice.actions;

export default transcriptViewGeneralSlice.reducer;
