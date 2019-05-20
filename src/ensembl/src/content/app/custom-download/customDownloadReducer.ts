import { ActionType, getType } from 'typesafe-actions';

import { RootAction } from 'src/objects';
import * as customDownloadActions from './customDownloadActions';
import {
  ResultState,
  defaultResultState,
  PreFilterState,
  defaultPreFilterState,
  TabButtonState,
  defaultTabButtonState
} from './customDownloadState';

import filtersAccordion from './containers/content/filter-accordion/FilterAccordionReducer';
import attributesAccordion from './containers/content/attributes-accordion/AttributesAccordionReducer';
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

function tabButton(
  state: TabButtonState = defaultTabButtonState,
  action: ActionType<RootAction>
): TabButtonState {
  switch (action.type) {
    case getType(customDownloadActions.toggleTabButton):
      return { ...state, selectedTabButton: action.payload };
    default:
      return state;
  }
}

function resultHolder(
  state: ResultState = defaultResultState,
  action: ActionType<RootAction>
): ResultState {
  switch (action.type) {
    case getType(customDownloadActions.setPreviewResult):
      return {
        ...state,
        previewResult: action.payload
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

export default combineReducers({
  filtersAccordion,
  attributesAccordion,
  preFilter,
  tabButton,
  resultHolder
});
