import { ActionType, getType } from 'typesafe-actions';

import { RootAction } from 'src/objects';
import * as filterActions from './filtersActions';
import { FiltersState, defaultFiltersState } from './filtersState';

function filters(
  state: FiltersState = defaultFiltersState,
  action: ActionType<RootAction>
): FiltersState {
  switch (action.type) {
    case getType(filterActions.setFiltersAccordionExpandedPanel):
      return { ...state, expandedPanel: action.payload };
    case getType(filterActions.updateSelectedFilters):
      return { ...state, selectedFilters: action.payload };
    case getType(filterActions.updateUi):
      return { ...state, ui: action.payload };
    case getType(filterActions.resetSelectedFilters):
      return { ...state, selectedFilters: {} };
    default:
      return state;
  }
}

export default filters;
