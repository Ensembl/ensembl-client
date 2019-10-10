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
  result: ResultState;
}>;

export const defaultCustomDownloadStateForGenome: CustomDownloadStateForGenome = {
  filters: defaultFiltersState,
  attributes: defaultAttributesState,
  preFilter: defaultPreFilterState,
  previewDownload: defaultPreviewDownloadState,
  result: defaultResultState
};

export type CustomDownloadActiveConfigurations = {
  [activeGenomeId: string]: CustomDownloadStateForGenome;
};

export type CustomDownloadState = {
  activeGenomeId: string | null;
  activeConfigurations: CustomDownloadActiveConfigurations;
};

export const getInitialCustomDownloadState = (): CustomDownloadState => {
  // FIXME: Remove this when species tab is implemented
  customDownloadStorageService.saveActiveGenomeId(
    'homo_sapiens_GCA_000001405_27'
  );

  const genomeId = customDownloadStorageService.getActiveGenomeId();
  if (!genomeId) {
    return {
      activeGenomeId: 'homo_sapiens_GCA_000001405_27',
      activeConfigurations: {}
    };
  }

  const activeConfigurations =
    customDownloadStorageService.getActiveConfigurations() || {};

  console.log(customDownloadStorageService.getActiveConfigurations());

  if (!activeConfigurations[genomeId]) {
    activeConfigurations[genomeId] = { ...defaultCustomDownloadStateForGenome };
  }

  return {
    activeGenomeId: genomeId,
    activeConfigurations: activeConfigurations
  };
};

export const getCustomDownloadConfigurationForGenome = (
  genomeId: string
): CustomDownloadStateForGenome => {
  const storedConfiguration =
    customDownloadStorageService.getActiveConfigurations()[genomeId] || {};
  return {
    ...defaultCustomDownloadStateForGenome,
    ...storedConfiguration
  };
};
