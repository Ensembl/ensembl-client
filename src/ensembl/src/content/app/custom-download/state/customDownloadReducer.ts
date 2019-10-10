import { ActionType, getType } from 'typesafe-actions';

import { RootAction } from 'src/objects';
import * as customDownloadActions from './customDownloadActions';
import {
  CustomDownloadState,
  getInitialCustomDownloadState,
  CustomDownloadActiveConfigurations
} from './customDownloadState';

export function customDownload(
  state: CustomDownloadState = getInitialCustomDownloadState(),
  action: ActionType<typeof customDownloadActions>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.setActiveGenomeId):
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
