import { ActionType, getType } from 'typesafe-actions';

import { RootAction } from 'src/objects';
import * as filterAccordionActions from './FilterAccordionActions';
import {
  FilterAccordionState,
  defaultFilterAccordionState
} from './FilterAccordionState';

function filterAccordion(
  state: FilterAccordionState = defaultFilterAccordionState,
  action: ActionType<RootAction>
): FilterAccordionState {
  switch (action.type) {
    case getType(filterAccordionActions.setFiltersAccordionExpandedPanel):
      return { ...state, expandedPanel: action.payload };
    case getType(filterAccordionActions.setFiltersAccordionExpandedGenePanels):
      return { ...state, expandedGenePanels: action.payload };
    case getType(filterAccordionActions.setGeneFilters):
      return { ...state, filters: Filters(state.filters, action) };
    case getType(filterAccordionActions.setGeneTypeFilters):
      return { ...state, filters: Filters(state.filters, action) };
    case getType(filterAccordionActions.setTranscriptTypeFilters):
      return { ...state, filters: Filters(state.filters, action) };
    default:
      return state;
  }
}

function Filters(
  state: any = defaultFilterAccordionState,
  action: ActionType<RootAction>
): FilterAccordionState {
  switch (action.type) {
    case getType(filterAccordionActions.setGeneFilters):
      return { ...state, gene: action.payload };
    case getType(filterAccordionActions.setGeneTypeFilters):
      return { ...state, gene_type: action.payload };
    case getType(filterAccordionActions.setTranscriptTypeFilters):
      return { ...state, biotype: action.payload };
    default:
      return state;
  }
}

export default filterAccordion;
