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

import { RootState } from 'src/store';

import {
  Attributes,
  AttributeWithOptions
} from 'src/content/app/custom-download/types/Attributes';
import { getCustomDownloadActiveGenomeConfiguration } from '../customDownloadSelectors';

export const getSelectedPreFilter = (state: RootState) => {
  const activeGenomeState = getCustomDownloadActiveGenomeConfiguration(state);

  return activeGenomeState ? activeGenomeState.preFilter.selectedPreFilter : '';
};

export const getAttributes = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes
    .content as Attributes;

export const getSelectedAttributes = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes
    .selectedAttributes;

export const getAttributesUi = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes.ui;

export const getOrthologueAttributes = (
  state: RootState
): { [key: string]: AttributeWithOptions } =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes.content
    .orthologues as {
    [key: string]: AttributeWithOptions;
  };

export const getOrthologueSearchTerm = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes.orthologue
    .searchTerm;

export const getOrthologueShowBestMatches = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes.orthologue
    .showBestMatches;

export const getOrthologueShowAll = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes.orthologue
    .showAll;

export const getOrthologueApplyToAllSpecies = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes.orthologue
    .applyToAllSpecies;

export const getOrthologueSpecies = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes.orthologue
    .species;

export const getAttributesAccordionExpandedPanels = (state: RootState) =>
  getCustomDownloadActiveGenomeConfiguration(state).attributes.expandedPanels ||
  [];
