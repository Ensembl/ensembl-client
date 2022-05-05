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

import { createAction, createAsyncAction } from 'typesafe-actions';
import set from 'lodash/fp/set';
import cloneDeep from 'lodash/cloneDeep';

import * as allFilterAccordionActions from './filters/filtersActions';
import * as allAttributeAccordionActions from './attributes/attributesActions';
import { ActionCreator, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import apiService from 'src/services/api-service';

import customDownloadStorageService from 'src/content/app/custom-download/services/custom-download-storage-service';
import JSONValue from 'src/shared/types/JSON';
import {
  CustomDownloadStateForGenome,
  defaultCustomDownloadStateForGenome
} from './customDownloadState';
import {
  getCustomDownloadActiveGenomeId,
  getCustomDownloadActiveGenomeConfiguration,
  getActiveConfigurations
} from './customDownloadSelectors';
import { RootState } from 'src/store';

export const filterActions = allFilterAccordionActions;
export const attributesActions = allAttributeAccordionActions;

export const updateActiveGenomeId = createAction(
  'custom-download/set-active-genome-id'
)<string | null>();

export const setActiveGenomeId: ActionCreator<
  ThunkAction<void, any, void, Action<string>>
> = (activeGenomeId: string) => (dispatch, getState: () => RootState) => {
  dispatch(updateActiveGenomeId(activeGenomeId));

  if (!getActiveConfigurations(getState())[activeGenomeId]) {
    dispatch(
      updateActiveConfigurationForGenome({
        activeGenomeId,
        data: cloneDeep(defaultCustomDownloadStateForGenome)
      })
    );
  }
};

export const updateActiveConfigurationForGenome = createAction(
  'custom-download/update-active-configuration-for-genome',
  (payload: { activeGenomeId: string; data: CustomDownloadStateForGenome }) => {
    const { activeGenomeId, data } = payload;

    customDownloadStorageService.updateActiveConfigurationsForGenome({
      [activeGenomeId]: data
    });
    return { activeGenomeId, data: cloneDeep(data) };
  }
)();

export const updateSelectedPreFilter: ActionCreator<
  ThunkAction<void, any, void, Action<string>>
> = (selectedPreFilter: boolean) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: set(
        'preFilter.selectedPreFilter',
        selectedPreFilter,
        getCustomDownloadActiveGenomeConfiguration(getState())
      )
    })
  );
};

export const togglePreFiltersPanel: ActionCreator<
  ThunkAction<void, any, void, Action<string>>
> = (showPreFiltersPanel: boolean) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: set(
        'preFilter.showPreFiltersPanel',
        showPreFiltersPanel,
        getCustomDownloadActiveGenomeConfiguration(getState())
      )
    })
  );
};

export const setPreviewResult = createAsyncAction(
  'custom-download/preview-results-request',
  'custom-download/preview-results-success',
  'custom-download/preview-results-failure'
)<undefined, JSONValue, Error>();

export const fetchPreviewResult: ActionCreator<
  ThunkAction<void, any, void, Action<string>>
> = (endpointURL: string) => (dispatch) => {
  try {
    apiService
      .fetch(endpointURL, {
        headers: {
          'Content-Type': 'application/json'
        },
        preserveEndpoint: true
      })
      .then((response: JSONValue) => {
        dispatch(setPreviewResult.success(response));
      });
  } catch (error) {
    dispatch(setPreviewResult.failure(error as Error));
  }
};

export const setIsLoadingResult = createAction(
  'custom-download/set-is-loading-result'
)<boolean>();

export const setShowPreview: ActionCreator<
  ThunkAction<void, any, void, Action<string>>
> = (showSummary: boolean) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: set(
        'previewDownload.showSummary',
        showSummary,
        getCustomDownloadActiveGenomeConfiguration(getState())
      )
    })
  );
};

export const setShowExampleData: ActionCreator<
  ThunkAction<void, any, void, Action<string>>
> = (showExampleData: boolean) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: set(
        'previewDownload.showExampleData',
        showExampleData,
        getCustomDownloadActiveGenomeConfiguration(getState())
      )
    })
  );
};

export const setDownloadType: ActionCreator<
  ThunkAction<void, any, void, Action<string>>
> = (downloadType: string) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: set(
        'previewDownload.downloadType',
        downloadType,
        getCustomDownloadActiveGenomeConfiguration(getState())
      )
    })
  );
};
