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

import { ActionType, getType } from 'typesafe-actions';

import * as customDownloadActions from './customDownloadActions';
import {
  CustomDownloadState,
  getInitialCustomDownloadState,
  CustomDownloadActiveConfigurations,
  ResultState,
  defaultResultState
} from './customDownloadState';

export function customDownload(
  state: CustomDownloadState = getInitialCustomDownloadState(),
  action: ActionType<typeof customDownloadActions>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.updateActiveGenomeId):
      return {
        ...state,
        activeGenomeId: action.payload
      };
    case getType(customDownloadActions.updateActiveConfigurationForGenome):
      return {
        ...state,
        activeConfigurations: activeConfigurations(
          state.activeConfigurations,
          action
        )
      };
    case getType(customDownloadActions.setIsLoadingResult):
      return {
        ...state,
        result: result(state.result, action)
      };
    case getType(customDownloadActions.setPreviewResult.success):
      return {
        ...state,
        result: result(state.result, action)
      };
    default:
      return state;
  }
}

function result(
  state: ResultState = defaultResultState,
  action: ActionType<any>
): ResultState {
  switch (action.type) {
    case getType(customDownloadActions.setIsLoadingResult):
      return {
        ...state,
        isLoadingResult: action.payload
      };
    case getType(customDownloadActions.setPreviewResult.success):
      return {
        ...state,
        preview: action.payload
      };
    default:
      return state;
  }
}

function activeConfigurations(
  state: CustomDownloadActiveConfigurations = getInitialCustomDownloadState()
    .activeConfigurations,
  action: ActionType<any>
): CustomDownloadActiveConfigurations {
  switch (action.type) {
    case getType(customDownloadActions.updateActiveConfigurationForGenome):
      return {
        ...state,
        [action.payload.activeGenomeId]: action.payload.data
      } as CustomDownloadActiveConfigurations;
    default:
      return state;
  }
}

export default customDownload;
