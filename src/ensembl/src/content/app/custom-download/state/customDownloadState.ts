import JSONValue from 'src/shared/types/JSON';
import { FiltersState, defaultFiltersState } from './filters/filtersState';
import {
  AttributesState,
  defaultAttributesState
} from './attributes/attributesState';

import customDownloadStorageService from 'src/content/app/custom-download/services/custom-download-storage-service';

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
  const activeGenomeId = customDownloadStorageService.getActiveGenomeId();
  const activeConfigurations =
    customDownloadStorageService.getActiveConfigurations() || {};

  return {
    activeGenomeId,
    activeConfigurations,
    result: defaultResultState
  };
};
