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

import { RootState } from 'src/store';
import { defaultCustomDownloadStateForGenome } from './customDownloadState';

export const getCustomDownloadActiveGenomeId = (state: RootState) =>
  state.customDownload.activeGenomeId || null;

export const getCustomDownloadActiveGenomeConfiguration = (
  state: RootState
) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(state);

  if (!activeGenomeId) {
    return defaultCustomDownloadStateForGenome;
  }
  return (
    state.customDownload.activeConfigurations[activeGenomeId] ||
    defaultCustomDownloadStateForGenome
  );
};

export const getActiveConfigurations = (state: RootState) =>
  state.customDownload.activeConfigurations;
export const getSelectedPreFilter = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).preFilter.selectedPreFilter;

export const getShowPreFilterPanel = (state: RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(state);

  return activeGenomeId
    ? getCustomDownloadActiveGenomeConfiguration(state).preFilter
        .showPreFiltersPanel
    : false;
};

export const getPreviewResult = (state: RootState) =>
  state.customDownload.result.preview;

export const getIsLoadingResult = (state: RootState) =>
  state.customDownload.result.isLoadingResult;

export const getShowPreviewResult = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).previewDownload.showSummary;

export const getShowExampleData = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).previewDownload
    .showExampleData;

export const getDownloadType = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).previewDownload
    .downloadType;
