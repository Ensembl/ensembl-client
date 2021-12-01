/**
 * See the NOTICE file distributed with this work for additional information
 * regarding copyright ownership.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
