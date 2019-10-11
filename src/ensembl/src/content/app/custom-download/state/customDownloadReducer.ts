import { ActionType, getType } from 'typesafe-actions';

import { RootAction } from 'src/objects';
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
  action: ActionType<RootAction>
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
  state: CustomDownloadActiveConfigurations = getInitialCustomDownloadState()[
    'activeConfigurations'
  ],
  action: ActionType<RootAction>
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
