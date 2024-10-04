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
  createSlice,
  createAsyncThunk,
  nanoid,
  type Action,
  type PayloadAction,
  type ThunkAction,
  type ActionCreator
} from '@reduxjs/toolkit';

import { getBreakpointWidth } from 'src/global/globalSelectors';

import { BreakpointWidth, type ScrollPosition } from './globalConfig';
import type { RootState } from 'src/store';

export type GlobalState = Readonly<{
  browserTabId: string | null;
  breakpointWidth: BreakpointWidth;
  scrollPosition: ScrollPosition;
  currentApp: string;
}>;

export const defaultState: GlobalState = {
  browserTabId: null,
  breakpointWidth: BreakpointWidth.DESKTOP,
  scrollPosition: {},
  currentApp: ''
};

export const updateBreakpointWidth: ActionCreator<
  ThunkAction<void, RootState, void, Action<string>>
> = (viewportWidth: BreakpointWidth) => async (dispatch, getState) => {
  const state = getState();
  const currentBreakpointWidth = getBreakpointWidth(state);

  if (viewportWidth !== currentBreakpointWidth) {
    dispatch(setBreakpointWidth(viewportWidth));
  }
};

/**
 * Creates a unique id for the browser tab.
 * NOTE: Consider if it is possible to persist the id between page refreshes.
 * See https://stackoverflow.com/a/61415444/3925302, which discusses
 * how to distinguish between page reloads and tab duplication
 */
export const setBrowserTabId = createAsyncThunk(
  'global/set-browser-tab-id',
  () => {
    const browserTabId = nanoid();

    return {
      browserTabId
    };
  }
);

const globalSlice = createSlice({
  name: 'global',
  initialState: defaultState,
  reducers: {
    setBreakpointWidth(state, action: PayloadAction<BreakpointWidth>) {
      state.breakpointWidth = action.payload;
    },
    saveScrollPosition(state, action: PayloadAction<ScrollPosition>) {
      state.scrollPosition = { ...state.scrollPosition, ...action.payload };
    },
    changeCurrentApp(state, action: PayloadAction<string>) {
      state.currentApp = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(setBrowserTabId.fulfilled, (state, action) => {
      state.browserTabId = action.payload.browserTabId;
    });
  }
});

export const { setBreakpointWidth, saveScrollPosition, changeCurrentApp } =
  globalSlice.actions;

export default globalSlice.reducer;
