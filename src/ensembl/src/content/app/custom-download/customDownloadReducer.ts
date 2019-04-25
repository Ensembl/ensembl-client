import { ActionType, getType } from 'typesafe-actions';

import { RootAction } from 'src/objects';
import * as customDownloadActions from './customDownloadActions';
import {
  CustomDownloadState,
  defaultCustomDownloadState
} from './customDownloadState';

function customDownload(
  state: CustomDownloadState = defaultCustomDownloadState,
  action: ActionType<RootAction>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.updateSelectedPreFilter):
      return { ...state, selectedPreFilter: action.payload };
    case getType(customDownloadActions.togglePreFiltersPanel):
      return { ...state, showPreFiltersPanel: action.payload };
    case getType(customDownloadActions.toggleTabButton):
      return { ...state, selectedTabButton: action.payload };
    case getType(customDownloadActions.setAttributes):
      return {
        ...state,
        attributesAccordion: attributesAccordion(
          state.attributesAccordion,
          action
        )
      };
    case getType(customDownloadActions.setAttributesAccordionExpandedPanel):
      return {
        ...state,
        attributesAccordion: attributesAccordion(
          state.attributesAccordion,
          action
        )
      };
    case getType(customDownloadActions.setVariationAccordionExpandedPanels):
      return {
        ...state,
        attributesAccordion: attributesAccordion(
          state.attributesAccordion,
          action
        )
      };
    case getType(customDownloadActions.setGeneAttributes):
      return {
        ...state,
        attributesAccordion: attributesAccordion(
          state.attributesAccordion,
          action
        )
      };
    case getType(customDownloadActions.setTranscriptAttributes):
      return {
        ...state,
        attributesAccordion: attributesAccordion(
          state.attributesAccordion,
          action
        )
      };
    case getType(customDownloadActions.setLocationAttributes):
      return {
        ...state,
        attributesAccordion: attributesAccordion(
          state.attributesAccordion,
          action
        )
      };
    case getType(customDownloadActions.setSomaticVariationAttributes):
      return {
        ...state,
        attributesAccordion: attributesAccordion(
          state.attributesAccordion,
          action
        )
      };
    case getType(customDownloadActions.setGermlineVariationAttributes):
      return {
        ...state,
        attributesAccordion: attributesAccordion(
          state.attributesAccordion,
          action
        )
      };
    case getType(customDownloadActions.setOrthologueAttributes):
      return {
        ...state,
        attributesAccordion: attributesAccordion(
          state.attributesAccordion,
          action
        )
      };
    case getType(customDownloadActions.setOrthologueSearchTerm):
      return {
        ...state,
        attributesAccordion: attributesAccordion(
          state.attributesAccordion,
          action
        )
      };
    case getType(customDownloadActions.setOrthologueSpecies):
      return {
        ...state,
        attributesAccordion: attributesAccordion(
          state.attributesAccordion,
          action
        )
      };
    case getType(customDownloadActions.setFiltersAccordionExpandedPanel):
      return {
        ...state,
        filtersAccordion: FiltersAccordion(state.filtersAccordion, action)
      };
    case getType(customDownloadActions.setFiltersAccordionExpandedGenePanels):
      return {
        ...state,
        filtersAccordion: FiltersAccordion(state.filtersAccordion, action)
      };
    case getType(customDownloadActions.setGeneFilters):
      return {
        ...state,
        filters: GeneFilters(state.filters, action)
      };
    case getType(customDownloadActions.setGeneTypeFilters):
      return {
        ...state,
        filters: GeneTypeFilters(state.filters, action)
      };
    case getType(customDownloadActions.setTranscriptTypeFilters):
      return {
        ...state,
        filters: TranscriptTypeFilters(state.filters, action)
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

function attributesAccordion(
  state: any = defaultCustomDownloadState,
  action: ActionType<RootAction>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.setAttributesAccordionExpandedPanel):
      return { ...state, expandedPanel: action.payload };
    case getType(customDownloadActions.setVariationAccordionExpandedPanels):
      return { ...state, expandedVariationPanels: action.payload };
    case getType(customDownloadActions.setAttributes):
      return { ...state, attributes: action.payload };
    case getType(customDownloadActions.setGeneAttributes):
      return {
        ...state,
        attributes: GeneAttributes(state.attributes, action)
      };
    case getType(customDownloadActions.setOrthologueAttributes):
      return {
        ...state,
        attributes: OrthologueAttributes(state.attributes, action)
      };
    case getType(customDownloadActions.setTranscriptAttributes):
      return {
        ...state,
        attributes: TranscriptAttributes(state.attributes, action)
      };
    case getType(customDownloadActions.setLocationAttributes):
      return {
        ...state,
        attributes: LocationAttributes(state.attributes, action)
      };
    case getType(customDownloadActions.setSomaticVariationAttributes):
      return {
        ...state,
        attributes: VariationAttributes(state.attributes, action)
      };
    case getType(customDownloadActions.setGermlineVariationAttributes):
      return {
        ...state,
        attributes: VariationAttributes(state.attributes, action)
      };
    case getType(customDownloadActions.setOrthologueSearchTerm):
      return {
        ...state,
        orthologue: Orthologue(state.orthologue, action)
      };
    case getType(customDownloadActions.setOrthologueSpecies):
      return {
        ...state,
        orthologue: Orthologue(state.orthologue, action)
      };
    default:
      return state;
  }
}

function GeneAttributes(
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

function Orthologue(
  state: any = defaultCustomDownloadState,
  action: ActionType<RootAction>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.setOrthologueSearchTerm):
      return { ...state, searchTerm: action.payload };
    case getType(customDownloadActions.setOrthologueSpecies):
      return { ...state, species: action.payload };
    default:
      return state;
  }
}

function OrthologueAttributes(
  state: any = defaultCustomDownloadState,
  action: ActionType<RootAction>
): CustomDownloadState {
  switch (action.type) {
    case getType(customDownloadActions.setOrthologueAttributes):
      return { ...state, orthologue: action.payload };
    default:
      return state;
  }
}

function TranscriptAttributes(
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

function LocationAttributes(
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

function VariationAttributes(
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

function FiltersAccordion(
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

function GeneFilters(
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

function GeneTypeFilters(
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

function TranscriptTypeFilters(
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

export default customDownload;
