import { combineReducers } from 'redux';
import { ActionType, getType } from 'typesafe-actions';

import { RootAction } from 'src/objects';
import * as customDownloadActions from './customDownloadActions';
import {
  CustomDownloadState,
  defaultCustomDownloadState
} from './customDownloadState';

function preFilterPanel(
  state: CustomDownloadState = defaultCustomDownloadState,
  action: ActionType<RootAction>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.updateSelectedPreFilter):
      return { ...state, selectedPreFilter: action.payload };
    case getType(customDownloadActions.togglePreFiltersPanel):
      return { ...state, showPreFiltersPanel: action.payload };
    default:
      return state;
  }
}

function contentPanel(
  state: CustomDownloadState = defaultCustomDownloadState,
  action: ActionType<RootAction>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.toggleTabButton):
      return { ...state, selectedTabButton: action.payload };
    case getType(customDownloadActions.setAttributes):
      return { ...state, attributes: action.payload };
    case getType(customDownloadActions.setGeneAttributes):
      return {
        ...state,
        attributes: contentPanelGeneAttributes(state.attributes, action)
      };
    case getType(customDownloadActions.setTranscriptAttributes):
      return {
        ...state,
        attributes: contentPanelTranscriptAttributes(state.attributes, action)
      };
    case getType(customDownloadActions.setLocationAttributes):
      return {
        ...state,
        attributes: contentPanelLocationAttributes(state.attributes, action)
      };
    case getType(customDownloadActions.setSomaticVariationAttributes):
      return {
        ...state,
        attributes: contentPanelVariationAttributes(state.attributes, action)
      };
    case getType(customDownloadActions.setGermlineVariationAttributes):
      return {
        ...state,
        attributes: contentPanelVariationAttributes(state.attributes, action)
      };
    case getType(customDownloadActions.setAttributesAccordionExpandedPanel):
      return {
        ...state,
        attributesAccordion: contentPanelAttributesAccordion(
          state.attributesAccordion,
          action
        )
      };
    case getType(customDownloadActions.setVariationAccordionExpandedPanels):
      return {
        ...state,
        attributesAccordion: contentPanelAttributesAccordion(
          state.attributesAccordion,
          action
        )
      };
    case getType(customDownloadActions.setFiltersAccordionExpandedPanel):
      return {
        ...state,
        filtersAccordion: contentPanelFiltersAccordion(
          state.filtersAccordion,
          action
        )
      };
    case getType(customDownloadActions.setFiltersAccordionExpandedGenePanels):
      return {
        ...state,
        filtersAccordion: contentPanelFiltersAccordion(
          state.filtersAccordion,
          action
        )
      };
    case getType(customDownloadActions.setGeneFilters):
      return {
        ...state,
        filters: contentPanelGeneFilters(state.filters, action)
      };
    case getType(customDownloadActions.setGeneTypeFilters):
      return {
        ...state,
        filters: contentPanelGeneTypeFilters(state.filters, action)
      };
    case getType(customDownloadActions.setTranscriptTypeFilters):
      return {
        ...state,
        filters: contentPanelTranscriptTypeFilters(state.filters, action)
      };
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

function contentPanelAttributesAccordion(
  state: any = defaultCustomDownloadState,
  action: ActionType<RootAction>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.setAttributesAccordionExpandedPanel):
      return { ...state, expandedPanel: action.payload };
    case getType(customDownloadActions.setVariationAccordionExpandedPanels):
      return { ...state, expandedVariationPanels: action.payload };
    default:
      return state;
  }
}

function contentPanelFiltersAccordion(
  state: any = defaultCustomDownloadState,
  action: ActionType<RootAction>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.setFiltersAccordionExpandedPanel):
      return { ...state, expandedPanel: action.payload };
    case getType(customDownloadActions.setFiltersAccordionExpandedGenePanels):
      return { ...state, expandedGenePanels: action.payload };
    default:
      return state;
  }
}

function contentPanelGeneFilters(
  state: any = defaultCustomDownloadState,
  action: ActionType<RootAction>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.setGeneFilters):
      return { ...state, gene: action.payload };
    default:
      return state;
  }
}

function contentPanelGeneTypeFilters(
  state: any = defaultCustomDownloadState,
  action: ActionType<RootAction>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.setGeneTypeFilters):
      return { ...state, gene_type: action.payload };
    default:
      return state;
  }
}

function contentPanelTranscriptTypeFilters(
  state: any = defaultCustomDownloadState,
  action: ActionType<RootAction>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.setTranscriptTypeFilters):
      return { ...state, biotype: action.payload };
    default:
      return state;
  }
}

function contentPanelGeneAttributes(
  state: any = defaultCustomDownloadState,
  action: ActionType<RootAction>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.setGeneAttributes):
      return { ...state, gene: action.payload };
    default:
      return state;
  }
}

function contentPanelTranscriptAttributes(
  state: any = defaultCustomDownloadState,
  action: ActionType<RootAction>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.setTranscriptAttributes):
      return { ...state, transcripts: action.payload };
    default:
      return state;
  }
}

function contentPanelLocationAttributes(
  state: any = defaultCustomDownloadState,
  action: ActionType<RootAction>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.setLocationAttributes):
      return { ...state, location: action.payload };
    default:
      return state;
  }
}

function contentPanelVariationAttributes(
  state: any = defaultCustomDownloadState,
  action: ActionType<RootAction>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.setSomaticVariationAttributes):
      return { ...state, somatic_variation: action.payload };
    case getType(customDownloadActions.setGermlineVariationAttributes):
      return { ...state, germline_variation: action.payload };
    default:
      return state;
  }
}

export default combineReducers({
  preFilterPanel,
  contentPanel
});
