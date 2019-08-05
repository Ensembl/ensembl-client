import { ActionType, getType } from 'typesafe-actions';

import { RootAction } from 'src/objects';
import * as attributesActions from './attributesActions';
import {
  AttributesState,
  defaultAttributesState,
  OrthologueState,
  AttributeUi
} from './attributesState';

function attributes(
  state: AttributesState = defaultAttributesState,
  action: ActionType<RootAction>
): AttributesState {
  switch (action.type) {
    case getType(attributesActions.setAttributesAccordionExpandedPanel):
      return { ...state, expandedPanel: action.payload };
    case getType(attributesActions.setAttributes.success):
      return { ...state, content: action.payload };
    case getType(attributesActions.updateSelectedAttributes):
      return {
        ...state,
        selectedAttributes: action.payload
      };
    case getType(attributesActions.resetSelectedAttributes):
      return {
        ...state,
        selectedAttributes: {}
      };
    case getType(attributesActions.updateUi):
      return {
        ...state,
        ui: action.payload
      };
    case getType(attributesActions.setOrthologueAttributes):
      return {
        ...state,
        content: orthologueAttributes(state.content, action)
      };
    case getType(attributesActions.setOrthologueSearchTerm):
      return {
        ...state,
        orthologue: orthologue(state.orthologue, action)
      };
    case getType(attributesActions.setOrthologueShowBestMatches):
      return {
        ...state,
        orthologue: orthologue(state.orthologue, action)
      };
    case getType(attributesActions.setOrthologueApplyToAllSpecies):
      return {
        ...state,
        orthologue: orthologue(state.orthologue, action)
      };
    case getType(attributesActions.setOrthologueShowAll):
      return {
        ...state,
        orthologue: orthologue(state.orthologue, action)
      };
    case getType(attributesActions.setOrthologueSpecies.success):
      return {
        ...state,
        orthologue: orthologue(state.orthologue, action)
      };
    default:
      return state;
  }
}

function orthologue(
  state: OrthologueState = defaultAttributesState.orthologue,
  action: ActionType<RootAction>
): OrthologueState {
  switch (action.type) {
    case getType(attributesActions.setOrthologueSearchTerm):
      return { ...state, searchTerm: action.payload };
    case getType(attributesActions.setOrthologueShowBestMatches):
      return { ...state, showBestMatches: action.payload };
    case getType(attributesActions.setOrthologueShowAll):
      return { ...state, showAll: action.payload };
    case getType(attributesActions.setOrthologueApplyToAllSpecies):
      return { ...state, applyToAllSpecies: action.payload };
    case getType(attributesActions.setOrthologueSpecies.success):
      return { ...state, species: action.payload };
    default:
      return state;
  }
}

function orthologueAttributes(
  state: AttributeUi = defaultAttributesState.content,
  action: ActionType<RootAction>
): AttributeUi {
  switch (action.type) {
    case getType(attributesActions.setOrthologueAttributes):
      return { ...state, orthologues: action.payload };
    default:
      return state;
  }
}

export default attributes;
