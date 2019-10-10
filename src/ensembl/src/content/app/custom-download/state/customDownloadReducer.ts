import { ActionType, getType } from 'typesafe-actions';

import { RootAction } from 'src/objects';
import * as customDownloadActions from './customDownloadActions';
import {
  // ResultState,
  // defaultResultState,
  // PreFilterState,
  // defaultPreFilterState,
  // PreviewDownloadState,
  // defaultPreviewDownloadState,
  CustomDownloadState,
  getInitialCustomDownloadState,
  CustomDownloadActiveConfigurations
} from './customDownloadState';

// import filters from './filters/filtersReducer';
// import attributes from './attributes/attributesReducer';
// import { combineReducers } from 'redux';

// function preFilter(
//   state: PreFilterState = defaultPreFilterState,
//   action: ActionType<RootAction>
// ): PreFilterState {
//   switch (action.type) {
//     case getType(customDownloadActions.updateSelectedPreFilter):
//       return { ...state, selectedPreFilter: action.payload };
//     case getType(customDownloadActions.togglePreFiltersPanel):
//       return { ...state, showPreFiltersPanel: action.payload };
//     default:
//       return state;
//   }
// }

// function result(
//   state: ResultState = defaultResultState,
//   action: ActionType<RootAction>
// ): ResultState {
//   switch (action.type) {
//     case getType(customDownloadActions.setPreviewResult.success):
//       return {
//         ...state,
//         preview: action.payload
//       };
//     case getType(customDownloadActions.setIsLoadingResult):
//       return {
//         ...state,
//         isLoadingResult: action.payload
//       };

//     default:
//       return state;
//   }
// }

// function previewDownload(
//   state: PreviewDownloadState = defaultPreviewDownloadState,
//   action: ActionType<RootAction>
// ): PreviewDownloadState {
//   switch (action.type) {
//     case getType(customDownloadActions.setShowPreview):
//       return {
//         ...state,
//         showSummary: action.payload
//       };
//     case getType(customDownloadActions.setShowExampleData):
//       return {
//         ...state,
//         showExampleData: action.payload
//       };
//     case getType(customDownloadActions.setDownloadType):
//       return {
//         ...state,
//         downloadType: action.payload
//       };

//     default:
//       return state;
//   }
// }

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
  state: CustomDownloadActiveConfigurations = getInitialCustomDownloadState()
    .activeConfigurations,
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
