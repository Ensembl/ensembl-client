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

import { getEntityViewerActiveGenomeId } from '../general/entityViewerGeneralSelectors';
import { isEntityViewerSidebarOpen } from 'src/content/app/entity-viewer/state/sidebar/entityViewerSidebarSelectors';

import { Status } from 'src/shared/types/status';
import type { AccordionSectionID as OverviewMainAccordionSectionID } from 'src/content/app/entity-viewer/gene-view/components/gene-view-sidebar/overview/MainAccordion';
import type { RootState } from 'src/store';

export type ToggleStatus = Status.OPEN | Status.CLOSED;

export enum SidebarTabName {
  OVERVIEW = 'Overview',
  EXTERNAL_REFERENCES = 'External references'
}

export enum SidebarModalView {
  SEARCH = 'search',
  BOOKMARKS = 'bookmarks',
  DOWNLOAD = 'download'
}

export type EntityViewerSidebarState = Readonly<{
  [genomeId: string]: EntityViewerSidebarGenomeState;
}>;

export type EntityViewerSidebarGenomeState = Readonly<{
  status: ToggleStatus;
  selectedTabName: SidebarTabName;
  sidebarModalView: SidebarModalView | null;
}>;

export type EntityViewerSidebarUIState = {
  mainAccordion?: {
    expandedPanels?: OverviewMainAccordionSectionID[];
  };
};

export const setSidebarTabName =
  (
    tabName: SidebarTabName
  ): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const genomeId = getEntityViewerActiveGenomeId(getState());

    if (!genomeId) {
      return;
    }

    dispatch(
      updateGenomeState({
        genomeId,
        fragment: { selectedTabName: tabName }
      })
    );
  };

export const toggleSidebar =
  (status?: ToggleStatus): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const state = getState();

    const genomeId = getEntityViewerActiveGenomeId(state);

    if (!genomeId) {
      return;
    }

    if (status === undefined) {
      const isCurrentlyOpen = isEntityViewerSidebarOpen(state);
      status = isCurrentlyOpen ? Status.CLOSED : Status.OPEN;
    }

    dispatch(updateGenomeState({ genomeId, fragment: { status } }));
  };

export const openSidebar = () => toggleSidebar(Status.OPEN);

export const closeSidebar = () => toggleSidebar(Status.CLOSED);

export const openSidebarModal =
  (
    sidebarModalView: SidebarModalView
  ): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const state = getState();

    const genomeId = getEntityViewerActiveGenomeId(state);
    if (!genomeId) {
      return;
    }

    dispatch(
      updateGenomeState({
        genomeId,
        fragment: {
          sidebarModalView
        }
      })
    );
  };

export const closeSidebarModal =
  (): ThunkAction<void, RootState, void, Action<string>> =>
  (dispatch, getState) => {
    const state = getState();
    const genomeId = getEntityViewerActiveGenomeId(state);

    if (!genomeId) {
      return;
    }

    dispatch(
      updateGenomeState({
        genomeId,
        fragment: {
          sidebarModalView: null
        }
      })
    );
  };

export const buildInitialStateForGenome = (
  genomeId: string
): EntityViewerSidebarState => ({
  [genomeId]: {
    status: Status.OPEN,
    selectedTabName: SidebarTabName.OVERVIEW,
    sidebarModalView: null
  }
});

const entityViewerSidebarSlice = createSlice({
  name: 'entity-viewer-sidebar',
  initialState: {} as EntityViewerSidebarState,
  reducers: {
    initializeSidebar(state, action: PayloadAction<string>) {
      const genomeId = action.payload;
      if (!state[genomeId]) {
        state[genomeId] = buildInitialStateForGenome(genomeId)[genomeId];
      }
    },
    updateGenomeState(
      state,
      action: PayloadAction<{
        genomeId: string;
        fragment: Partial<EntityViewerSidebarGenomeState>;
      }>
    ) {
      const { genomeId, fragment: newFragment } = action.payload;
      const oldStateFragment =
        state[genomeId] || buildInitialStateForGenome(genomeId)[genomeId];
      const updatedFragment = {
        ...oldStateFragment,
        ...newFragment
      };
      state[genomeId] = updatedFragment;
    }
  }
});

export const { initializeSidebar, updateGenomeState } =
  entityViewerSidebarSlice.actions;

export default entityViewerSidebarSlice.reducer;
