import { ActionType, getType } from 'typesafe-actions';

import { RootAction } from 'src/objects';
import * as attributesAccordionActions from './attributesAccordionActions';
import {
  AttributesAccordionState,
  defaultAttributesAccordionState,
  OrthologueState,
  AttributeContentState
} from './attributesAccordionState';

function attributesAccordion(
  state: AttributesAccordionState = defaultAttributesAccordionState,
  action: ActionType<RootAction>
): AttributesAccordionState {
  switch (action.type) {
    case getType(
      attributesAccordionActions.setAttributesAccordionExpandedPanel
    ):
      return { ...state, expandedPanel: action.payload };
    case getType(attributesAccordionActions.setAttributes.success):
      return { ...state, content: action.payload };
    case getType(attributesAccordionActions.updateSelectedAttributes):
      return {
        ...state,
        selectedAttributes: action.payload
      };
    case getType(attributesAccordionActions.resetSelectedAttributes):
      return {
        ...state,
        selectedAttributes: {}
      };
    case getType(attributesAccordionActions.updateContentState):
      return {
        ...state,
        contentState: action.payload
      };
    case getType(attributesAccordionActions.setOrthologueAttributes):
      return {
        ...state,
        content: orthologueAttributes(state.content, action)
      };
    case getType(attributesAccordionActions.setOrthologueSearchTerm):
      return {
        ...state,
        orthologue: orthologue(state.orthologue, action)
      };
    case getType(attributesAccordionActions.setOrthologueShowBestMatches):
      return {
        ...state,
        orthologue: orthologue(state.orthologue, action)
      };
    case getType(attributesAccordionActions.setOrthologueApplyToAllSpecies):
      return {
        ...state,
        orthologue: orthologue(state.orthologue, action)
      };
    case getType(attributesAccordionActions.setOrthologueShowAll):
      return {
        ...state,
        orthologue: orthologue(state.orthologue, action)
      };
    case getType(attributesAccordionActions.setOrthologueSpecies.success):
      return {
        ...state,
        orthologue: orthologue(state.orthologue, action)
      };
    default:
      return state;
  }
}

function orthologue(
  state: OrthologueState = defaultAttributesAccordionState.orthologue,
  action: ActionType<RootAction>
): OrthologueState {
  switch (action.type) {
    case getType(attributesAccordionActions.setOrthologueSearchTerm):
      return { ...state, searchTerm: action.payload };
    case getType(attributesAccordionActions.setOrthologueShowBestMatches):
      return { ...state, showBestMatches: action.payload };
    case getType(attributesAccordionActions.setOrthologueShowAll):
      return { ...state, showAll: action.payload };
    case getType(attributesAccordionActions.setOrthologueApplyToAllSpecies):
      return { ...state, applyToAllSpecies: action.payload };
    case getType(attributesAccordionActions.setOrthologueSpecies.success):
      return { ...state, species: action.payload };
    default:
      return state;
  }
}

function orthologueAttributes(
  state: AttributeContentState = defaultAttributesAccordionState.content,
  action: ActionType<RootAction>
): AttributeContentState {
  switch (action.type) {
    case getType(attributesAccordionActions.setOrthologueAttributes):
      return { ...state, orthologues: action.payload };
    default:
      return state;
  }
}

export default attributesAccordion;
