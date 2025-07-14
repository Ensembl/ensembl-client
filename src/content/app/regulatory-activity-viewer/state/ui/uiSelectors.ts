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

import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from 'src/store';

export const getMainContentBottomView = (state: RootState, genomeId: string) =>
  state.regionActivityViewer.ui[genomeId]?.mainContentBottomView ?? 'dataviz';

export const getIsSidebarOpen = (state: RootState, genomeId: string) =>
  state.regionActivityViewer.ui[genomeId]?.isSidebarOpen ?? true;

export const getSidebarView = (state: RootState, genomeId: string) =>
  state.regionActivityViewer.ui[genomeId]?.sidebarView ?? 'default';

export const getHistones = createSelector(
  [
    (state: RootState) => state.regionActivityViewer.ui,
    (_, genomeId: string) => genomeId
  ],
  (uiState, genomeId) => uiState[genomeId]?.histones ?? []
);
