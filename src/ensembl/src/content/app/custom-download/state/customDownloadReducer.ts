import { ActionType, getType } from 'typesafe-actions';

import { RootAction } from 'src/objects';
import * as customDownloadActions from './customDownloadActions';
import {
  ResultState,
  defaultResultState,
  PreFilterState,
  defaultPreFilterState,
  TabState,
  defaultTabState,
  PreviewDownloadState,
  defaultPreviewDownloadState
} from './customDownloadState';

import filters from './filters/filterReducer';
import attributes from './attributes/attributesReducer';
import { combineReducers } from 'redux';

function preFilter(
  state: PreFilterState = defaultPreFilterState,
  action: ActionType<RootAction>
): PreFilterState {
  switch (action.type) {
    case getType(customDownloadActions.updateSelectedPreFilter):
      return { ...state, selectedPreFilter: action.payload };
    case getType(customDownloadActions.togglePreFiltersPanel):
      return { ...state, showPreFiltersPanel: action.payload };
    default:
      return state;
  }
}

function tab(
  state: TabState = defaultTabState,
  action: ActionType<RootAction>
): TabState {
  switch (action.type) {
    case getType(customDownloadActions.toggleTab):
      return { ...state, selectedTab: action.payload };
    default:
      return state;
  }
}

function result(
  state: ResultState = defaultResultState,
  action: ActionType<RootAction>
): ResultState {
  switch (action.type) {
    case getType(customDownloadActions.setPreviewResult.success):
      return {
        ...state,
        preview: action.payload
      };
    case getType(customDownloadActions.setIsLoadingResult):
      return {
        ...state,
        isLoadingResult: action.payload
      };

    default:
      return state;
  }
}

function previewDownload(
  state: PreviewDownloadState = defaultPreviewDownloadState,
  action: ActionType<RootAction>
): PreviewDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.setShowPreview):
      return {
        ...state,
        showSummary: action.payload
      };
    case getType(customDownloadActions.setDownloadType):
      return {
        ...state,
        downloadType: action.payload
      };

    default:
      return state;
  }
}

export default combineReducers({
  filters,
  attributes,
  preFilter,
  tab,
  result,
  previewDownload
});
