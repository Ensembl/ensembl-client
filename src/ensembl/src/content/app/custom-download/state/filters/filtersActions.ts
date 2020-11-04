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

import { ThunkAction } from 'redux-thunk';
import { ActionCreator, Action } from 'redux';
import set from 'lodash/fp/set';

import { RootState } from 'src/store';
import JSONValue from 'src/shared/types/JSON';
import { updateActiveConfigurationForGenome } from 'src/content/app/custom-download/state/customDownloadActions';
import {
  getCustomDownloadActiveGenomeId,
  getCustomDownloadActiveGenomeConfiguration
} from 'src/content/app/custom-download/state/customDownloadSelectors';

export const setFiltersAccordionExpandedPanel: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (expandedPanels: string[]) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: set(
        'filters.expandedPanels',
        expandedPanels,
        getCustomDownloadActiveGenomeConfiguration(getState())
      )
    })
  );
};

export const updateSelectedFilters: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (selectedFilters: JSONValue) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: set(
        'filters.selectedFilters',
        selectedFilters,
        getCustomDownloadActiveGenomeConfiguration(getState())
      )
    })
  );
};

export const updateUi: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = (filtersUi: JSONValue) => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: set(
        'filters.ui',
        filtersUi,
        getCustomDownloadActiveGenomeConfiguration(getState())
      )
    })
  );
};

export const resetSelectedFilters: ActionCreator<ThunkAction<
  void,
  any,
  null,
  Action<string>
>> = () => (dispatch, getState: () => RootState) => {
  const activeGenomeId = getCustomDownloadActiveGenomeId(getState());

  if (!activeGenomeId) {
    return;
  }

  dispatch(
    updateActiveConfigurationForGenome({
      activeGenomeId,
      data: set(
        'filters.selectedFilters',
        {},
        getCustomDownloadActiveGenomeConfiguration(getState())
      )
    })
  );
};
