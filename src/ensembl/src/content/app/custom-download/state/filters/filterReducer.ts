import { ActionType, getType } from 'typesafe-actions';

import { RootAction } from 'src/objects';
import * as filterActions from './filterActions';
import {
  FilterAccordionState,
  defaultFilterAccordionState
} from './filterState';

function filterAccordion(
  state: FilterAccordionState = defaultFilterAccordionState,
  action: ActionType<RootAction>
): FilterAccordionState {
  switch (action.type) {
    case getType(filterActions.setFiltersAccordionExpandedPanel):
      return { ...state, expandedPanel: action.payload };
    case getType(filterActions.updateSelectedFilters):
      return { ...state, selectedFilters: action.payload };
    case getType(filterActions.updateContentState):
      return { ...state, contentState: action.payload };
    case getType(filterActions.resetSelectedFilters):
      return { ...state, selectedFilters: {} };
    default:
      return state;
  }
}

export default filterAccordion;
