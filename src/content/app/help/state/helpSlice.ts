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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type HelpState = {
  navHistory: string[];
  currentItemIndex: number;
};

const initialState: HelpState = {
  navHistory: [],
  currentItemIndex: -1
};

const helpSlice = createSlice({
  name: 'species-page-general',
  initialState,
  reducers: {
    addPageToHistory(state, action: PayloadAction<string>) {
      const { navHistory, currentItemIndex } = state;
      const newNavHistory = navHistory
        .slice(0, currentItemIndex + 1)
        .concat(action.payload);

      state.navHistory = newNavHistory;
      state.currentItemIndex = newNavHistory.length - 1;
    },
    moveBackInHistory(state) {
      state.currentItemIndex = state.currentItemIndex - 1;
    },
    moveForwardInHistory(state) {
      state.currentItemIndex = state.currentItemIndex + 1;
    },
    resetNavHistory(state) {
      state.navHistory = [];
      state.currentItemIndex = -1;
    }
  }
});

export const {
  addPageToHistory,
  moveBackInHistory,
  moveForwardInHistory,
  resetNavHistory
} = helpSlice.actions;

export default helpSlice.reducer;
