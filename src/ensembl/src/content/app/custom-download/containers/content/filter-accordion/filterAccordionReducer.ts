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
    case getType(filterAccordionActions.setFiltersAccordionExpandedGenePanels):
      return { ...state, expandedGenePanels: action.payload };
    case getType(filterAccordionActions.setGeneSourceFilters):
      return { ...state, filters: Filters(state.filters, action) };
    case getType(filterAccordionActions.setGencodeAnnotationFilters):
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
    case getType(filterAccordionActions.setGeneSourceFilters):
      return { ...state, gene_source: action.payload };
    case getType(filterAccordionActions.setGencodeAnnotationFilters):
      return { ...state, gencode_basic_annotation: action.payload };
    case getType(filterAccordionActions.setGeneTypeFilters):
      return { ...state, gene_type: action.payload };
    case getType(filterAccordionActions.setTranscriptTypeFilters):
      return { ...state, biotype: action.payload };
    default:
      return state;
  }
}

export default filterAccordion;
