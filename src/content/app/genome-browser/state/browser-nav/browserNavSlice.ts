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
  Action,
  ActionCreator,
  createSlice,
  Dispatch,
  PayloadAction,
  ThunkAction
} from '@reduxjs/toolkit';
import { OutgoingActionType } from 'ensembl-genome-browser';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-entity/browserEntitySelectors';
import { getBrowserNavOpenState } from 'src/content/app/genome-browser/state/browser-nav/browserNavSelectors';

import { RootState } from 'src/store';

export enum BrowserNavAction {
  MOVE_UP = 'move_up',
  MOVE_DOWN = 'move_down',
  MOVE_LEFT = 'move_left',
  MOVE_RIGHT = 'move_right',
  ZOOM_IN = 'zoom_in',
  ZOOM_OUT = 'zoom_out'
}

export const browserNavIconActionMap = {
  [BrowserNavAction.MOVE_UP]: OutgoingActionType.MOVE_UP,
  [BrowserNavAction.MOVE_DOWN]: OutgoingActionType.MOVE_DOWN,
  [BrowserNavAction.MOVE_LEFT]: OutgoingActionType.MOVE_LEFT,
  [BrowserNavAction.MOVE_RIGHT]: OutgoingActionType.MOVE_RIGHT,
  [BrowserNavAction.ZOOM_OUT]: OutgoingActionType.ZOOM_OUT,
  [BrowserNavAction.ZOOM_IN]: OutgoingActionType.ZOOM_IN
};

// states are top, right, bottom, left (TRBL) and minus (zoom out) and plus (zoom in)
export type BrowserNavIconStates = {
  [key in BrowserNavAction]: boolean;
};

export const defaultBrowserNavIconsState = {
  [BrowserNavAction.MOVE_UP]: false,
  [BrowserNavAction.MOVE_DOWN]: false,
  [BrowserNavAction.MOVE_LEFT]: false,
  [BrowserNavAction.MOVE_RIGHT]: false,
  [BrowserNavAction.ZOOM_OUT]: false,
  [BrowserNavAction.ZOOM_IN]: false
};
export type BrowserNavState = Readonly<{
  browserNavOpenState: { [genomeId: string]: boolean };
  browserNavIconStates: BrowserNavIconStates;
}>;

export const defaultBrowserNavState = {
  browserNavOpenState: {},
  browserNavIconStates: defaultBrowserNavIconsState
};

export const toggleBrowserNav: ActionCreator<
  ThunkAction<any, any, null, Action<string>>
> = () => {
  return (dispatch: Dispatch, getState: () => RootState) => {
    const state = getState();
    const isBrowserNavOpenState = getBrowserNavOpenState(state);
    const activeGenomeId = getBrowserActiveGenomeId(state);

    if (!activeGenomeId) {
      return;
    }
    if (isBrowserNavOpenState) {
      dispatch(closeBrowserNav({ activeGenomeId }));
    } else {
      dispatch(openBrowserNav({ activeGenomeId }));
    }
  };
};

const browserNavSlice = createSlice({
  name: 'genome-browser-nav',
  initialState: defaultBrowserNavState as BrowserNavState,
  reducers: {
    openBrowserNav(
      state,
      action: PayloadAction<{
        activeGenomeId: string;
      }>
    ) {
      const { activeGenomeId } = action.payload;
      state.browserNavOpenState[activeGenomeId] = true;
    },
    closeBrowserNav(state, action: PayloadAction<{ activeGenomeId: string }>) {
      const { activeGenomeId } = action.payload;
      state.browserNavOpenState[activeGenomeId] = false;
    },
    updateBrowserNavIconStates(
      state,
      action: PayloadAction<{
        activeGenomeId: string;
        navStates: BrowserNavIconStates;
      }>
    ) {
      state.browserNavIconStates = action.payload.navStates;
    }
  }
});

export const { openBrowserNav, closeBrowserNav, updateBrowserNavIconStates } =
  browserNavSlice.actions;

export default browserNavSlice.reducer;
