import JSONValue from 'src/shared/types/JSON';
import { FiltersState, defaultFiltersState } from './filters/filtersState';
import {
  AttributesState,
  defaultAttributesState
} from './attributes/attributesState';

import customDownloadStorageService from 'src/content/app/custom-download/services/custom-download-storage-service';
import cloneDeep from 'lodash/cloneDeep';

export type ResultState = Readonly<{
  preview: JSONValue;
  isLoadingResult: boolean;
}>;

export const defaultResultState: ResultState = {
  preview: {
    resultCount: 0
  },
  isLoadingResult: false
};

export type PreFilterState = Readonly<{
  selectedPreFilter: string;
  showPreFiltersPanel: boolean;
}>;

export const defaultPreFilterState: PreFilterState = {
  selectedPreFilter: '',
  showPreFiltersPanel: true
};

export type PreviewDownloadState = Readonly<{
  showSummary: boolean;
  showExampleData: boolean;
  downloadType: string;
}>;

export const defaultPreviewDownloadState: PreviewDownloadState = {
  showSummary: false,
  showExampleData: false,
  downloadType: ''
};

export type CustomDownloadStateForGenome = Readonly<{
  filters: FiltersState;
  attributes: AttributesState;
  preFilter: PreFilterState;
  previewDownload: PreviewDownloadState;
}>;

export const defaultCustomDownloadStateForGenome: CustomDownloadStateForGenome = {
  filters: defaultFiltersState,
  attributes: defaultAttributesState,
  preFilter: defaultPreFilterState,
  previewDownload: defaultPreviewDownloadState
};

export type CustomDownloadActiveConfigurations = {
  [activeGenomeId: string]: CustomDownloadStateForGenome;
};

export type CustomDownloadState = {
  activeGenomeId: string | null;
  activeConfigurations: CustomDownloadActiveConfigurations;
  result: ResultState;
};

export const getInitialCustomDownloadState = (): CustomDownloadState => {
  const genomeId = customDownloadStorageService.getActiveGenomeId();
  const activeConfigurations =
    customDownloadStorageService.getActiveConfigurations() || {};

  if (!genomeId) {
    return {
      activeGenomeId: null,
      activeConfigurations: activeConfigurations,
      result: defaultResultState
    };
  }

  if (!activeConfigurations[genomeId]) {
    activeConfigurations[genomeId] = cloneDeep(
      defaultCustomDownloadStateForGenome
    );
  }

  return {
    activeGenomeId: genomeId,
    activeConfigurations: activeConfigurations,
    result: defaultResultState
  };
};
