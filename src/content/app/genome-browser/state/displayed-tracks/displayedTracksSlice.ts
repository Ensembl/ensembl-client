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

type DisplayedTrack = {
  id: string;
  height: number;
  offsetTop: number;
};

type DisplayedTracksState = DisplayedTrack[];

const displayedTracksSlice = createSlice({
  name: 'genome-browser-displayed-tracks',
  initialState: [] as DisplayedTracksState,
  reducers: {
    setDisplayedTracks(state, action: PayloadAction<DisplayedTrack[]>) {
      return action.payload;
    }
  }
});

export const { setDisplayedTracks } = displayedTracksSlice.actions;

export default displayedTracksSlice.reducer;
