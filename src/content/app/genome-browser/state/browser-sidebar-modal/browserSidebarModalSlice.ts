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
  type PayloadAction,
  type Action,
  type ThunkAction
} from '@reduxjs/toolkit';

import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSelectors';

import type { RootState } from 'src/store';

export enum BrowserSidebarModalView {
  SEARCH = 'search',
  BOOKMARKS = 'Previously viewed',
  SHARE = 'Share',
  DOWNLOADS = 'Downloads',
  NAVIGATE = 'Navigate'
}

export type BrowserSidebarModalStateForGenome = Readonly<{
  browserSidebarModalView: BrowserSidebarModalView | null;
}>;

export type BrowserSidebarModalState = Readonly<{
  [genomeId: string]: BrowserSidebarModalStateForGenome;
}>;

export const defaultBrowserSidebarModalStateForGenome: BrowserSidebarModalStateForGenome =
  {
    browserSidebarModalView: null
  };

export const openBrowserSidebarModal =
  (
    browserSidebarModalView: BrowserSidebarModalView
  ): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state);

    if (!activeGenomeId) {
      return;
    }

    const data = {
      ...state.browser.browserSidebarModal[activeGenomeId],
      browserSidebarModalView
    };

    dispatch(
      updateBrowserSidebarModalForGenome({
        activeGenomeId,
        data
      })
    );
  };

export const closeBrowserSidebarModal =
  (): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const state = getState();
    const activeGenomeId = getBrowserActiveGenomeId(state);

    if (!activeGenomeId) {
      return;
    }

    const data = {
      ...state.browser.browserSidebarModal[activeGenomeId],
      browserSidebarModalView: null
    };

    dispatch(
      updateBrowserSidebarModalForGenome({
        activeGenomeId,
        data
      })
    );
  };

const browserSidebarModal = createSlice({
  name: 'genome-browser-sidebar-modal',
  initialState: {} as BrowserSidebarModalState,
  reducers: {
    updateBrowserSidebarModalForGenome(
      state,
      action: PayloadAction<{
        activeGenomeId: string;
        data: Partial<BrowserSidebarModalStateForGenome>;
      }>
    ) {
      const { activeGenomeId, data } = action.payload;

      state[activeGenomeId] = {
        ...state[activeGenomeId],
        ...data
      };
    }
  }
});

export const { updateBrowserSidebarModalForGenome } =
  browserSidebarModal.actions;

export default browserSidebarModal.reducer;
