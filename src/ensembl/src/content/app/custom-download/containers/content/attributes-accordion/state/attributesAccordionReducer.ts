import { ActionType, getType } from 'typesafe-actions';

import { RootAction } from 'src/objects';
import * as attributesAccordionActions from './attributesAccordionActions';
import {
  AttributesAccordionState,
  defaultAttributesAccordionState
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
    case getType(
      attributesAccordionActions.setVariationAccordionExpandedPanels
    ):
      return { ...state, expandedVariationPanels: action.payload };
    case getType(attributesAccordionActions.setAttributes.success):
      return { ...state, attributes: action.payload };
    case getType(attributesAccordionActions.setGeneAttributes):
      return {
        ...state,
        attributes: GeneAttributes(state.attributes, action)
      };
    case getType(attributesAccordionActions.setOrthologueAttributes):
      return {
        ...state,
        attributes: OrthologueAttributes(state.attributes, action)
      };
    case getType(attributesAccordionActions.setTranscriptAttributes):
      return {
        ...state,
        attributes: TranscriptAttributes(state.attributes, action)
      };
    case getType(attributesAccordionActions.setPhenotypeAttributes):
      return {
        ...state,
        attributes: PhenotypeAttributes(state.attributes, action)
      };
    case getType(attributesAccordionActions.setLocationAttributes):
      return {
        ...state,
        attributes: LocationAttributes(state.attributes, action)
      };
    case getType(attributesAccordionActions.setSomaticVariationAttributes):
      return {
        ...state,
        attributes: VariationAttributes(state.attributes, action)
      };
    case getType(attributesAccordionActions.setGermlineVariationAttributes):
      return {
        ...state,
        attributes: VariationAttributes(state.attributes, action)
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

function GeneAttributes(
  state: any = defaultAttributesAccordionState,
  action: ActionType<RootAction>
): AttributesAccordionState {
  switch (action.type) {
    case getType(attributesAccordionActions.setGeneAttributes):
      return { ...state, gene: action.payload };
    default:
      return state;
  }
}

function Orthologue(
  state: any = defaultAttributesAccordionState,
  action: ActionType<RootAction>
): AttributesAccordionState {
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
  state: any = defaultAttributesAccordionState,
  action: ActionType<RootAction>
): AttributesAccordionState {
  switch (action.type) {
    case getType(attributesAccordionActions.setOrthologueAttributes):
      return { ...state, orthologues: action.payload };
    default:
      return state;
  }
}

function TranscriptAttributes(
  state: any = defaultAttributesAccordionState,
  action: ActionType<RootAction>
): AttributesAccordionState {
  switch (action.type) {
    case getType(attributesAccordionActions.setTranscriptAttributes):
      return { ...state, transcripts: action.payload };
    default:
      return state;
  }
}

function PhenotypeAttributes(
  state: any = defaultAttributesAccordionState,
  action: ActionType<RootAction>
): AttributesAccordionState {
  switch (action.type) {
    case getType(attributesAccordionActions.setPhenotypeAttributes):
      return { ...state, phenotypes: action.payload };
    default:
      return state;
  }
}

function LocationAttributes(
  state: any = defaultAttributesAccordionState,
  action: ActionType<RootAction>
): AttributesAccordionState {
  switch (action.type) {
    case getType(attributesAccordionActions.setLocationAttributes):
      return { ...state, location: action.payload };
    default:
      return state;
  }
}

function VariationAttributes(
  state: any = defaultAttributesAccordionState,
  action: ActionType<RootAction>
): AttributesAccordionState {
  switch (action.type) {
    case getType(attributesAccordionActions.setSomaticVariationAttributes):
      return { ...state, somatic_variation: action.payload };
    case getType(attributesAccordionActions.setGermlineVariationAttributes):
      return { ...state, germline_variation: action.payload };
    default:
      return state;
  }
}

export default attributesAccordion;
