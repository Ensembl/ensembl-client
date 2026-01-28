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

export const FeatureSearchMode = {
  GENE_SEARCH_MODE: 'Gene',
  VARIANT_SEARCH_MODE: 'Variant'
} as const;

export type FeatureSearchModeType = typeof FeatureSearchMode[keyof typeof FeatureSearchMode];

export type FeatureSearchLabels = {
  label: string;
  placeholder: string;
  help?: string;
};

const featureSearchModeLabels: Record<FeatureSearchModeType, FeatureSearchLabels> = {
  [FeatureSearchMode.GENE_SEARCH_MODE]: {
    label: 'Find a gene',
    placeholder: 'Gene ID or name',
    help: 'Find a gene using a stable ID (versioned or un-versioned), symbol or synonym'
  },
  [FeatureSearchMode.VARIANT_SEARCH_MODE]: {
    label: 'Find a variant',
    placeholder: 'Variant ID',
    help: 'Find a variant using rsID'
  }
};

export const getFeatureSearchModes = () => {
  return Object.values(FeatureSearchMode);
}

export const getFeatureSearchLabelsByMode = (mode: FeatureSearchModeType): FeatureSearchLabels => {
  return featureSearchModeLabels[mode];
};

export const getFeatureSearchModeByLocation = (locationPathname: string): FeatureSearchModeType => {
  return locationPathname.includes('/variant')
    ? FeatureSearchMode.VARIANT_SEARCH_MODE
    : FeatureSearchMode.GENE_SEARCH_MODE;
}
