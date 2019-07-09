import { ActionType, getType } from 'typesafe-actions';

import { RootAction } from 'src/objects';
import * as attributesAccordionActions from './attributesAccordionActions';
import {
  AttributesAccordionState,
  defaultAttributesAccordionState,
  OrthologueState
} from './attributesAccordionState';

import { CustomDownloadAttributes } from 'src/content/app/custom-download/types/Attributes';

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
      return { ...state, attributes: action.payload };
    case getType(attributesAccordionActions.updateSelectedAttributes):
      return {
        ...state,
        selectedAttributes: action.payload
      };
    case getType(attributesAccordionActions.setOrthologueAttributes):
      return {
        ...state,
        attributes: OrthologueAttributes(state.attributes, action)
      };
    case getType(attributesAccordionActions.setOrthologueSearchTerm):
      return {
        ...state,
        orthologue: Orthologue(state.orthologue, action)
      };
    case getType(attributesAccordionActions.setOrthologueShowBestMatches):
      return {
        ...state,
        orthologue: Orthologue(state.orthologue, action)
      };
    case getType(attributesAccordionActions.setOrthologueApplyToAllSpecies):
      return {
        ...state,
        orthologue: Orthologue(state.orthologue, action)
      };
    case getType(attributesAccordionActions.setOrthologueShowAll):
      return {
        ...state,
        orthologue: Orthologue(state.orthologue, action)
      };
    case getType(attributesAccordionActions.setOrthologueSpecies.success):
      return {
        ...state,
        orthologue: Orthologue(state.orthologue, action)
      };
    default:
      return state;
  }
}

function Orthologue(
  state: any = defaultAttributesAccordionState.orthologue,
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

function OrthologueAttributes(
  state: any = defaultAttributesAccordionState.attributes,
  action: ActionType<RootAction>
): CustomDownloadAttributes {
  switch (action.type) {
    case getType(attributesAccordionActions.setOrthologueAttributes):
      return { ...state, orthologues: action.payload };
    default:
      return state;
  }
}

export default attributesAccordion;
