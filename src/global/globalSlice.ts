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
  Action,
  PayloadAction,
  ThunkAction,
  ActionCreator
} from '@reduxjs/toolkit';

import { getBreakpointWidth } from 'src/global/globalSelectors';

import { BreakpointWidth, ScrollPosition } from './globalConfig';
import { RootState } from 'src/store';

export type GlobalState = Readonly<{
  breakpointWidth: BreakpointWidth;
  scrollPosition: ScrollPosition;
  currentApp: string;
}>;

export const defaultState: GlobalState = {
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
  }
});

export const { setBreakpointWidth, saveScrollPosition, changeCurrentApp } =
  globalSlice.actions;

export default globalSlice.reducer;
