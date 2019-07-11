import { ActionType, getType } from 'typesafe-actions';

import { RootAction } from 'src/objects';
import * as filterAccordionActions from './filterAccordionActions';
import {
  FilterAccordionState,
  defaultFilterAccordionState
} from './filterAccordionState';

function filterAccordion(
  state: FilterAccordionState = defaultFilterAccordionState,
  action: ActionType<RootAction>
): FilterAccordionState {
  switch (action.type) {
    case getType(filterAccordionActions.setFiltersAccordionExpandedPanel):
      return { ...state, expandedPanel: action.payload };
    case getType(filterAccordionActions.updateSelectedFilters):
      return { ...state, selectedFilters: action.payload };
    case getType(filterAccordionActions.updateContentState):
      return { ...state, contentState: action.payload };
    default:
      return state;
  }
}

export default filterAccordion;
