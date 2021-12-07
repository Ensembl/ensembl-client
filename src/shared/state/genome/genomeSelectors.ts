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
import { GenomeInfo, GenomeInfoData } from './genomeTypes';
import { getBrowserActiveGenomeId } from 'src/content/app/genome-browser/state/browser-entity/browserEntitySelectors';

export const getGenomeInfo = (state: RootState) =>
  state.genome.genomeInfo.genomeInfoData as GenomeInfoData;

export const getGenomeInfoById = (
  state: RootState,
  genomeId: string
): GenomeInfo | null => {
  const allGenomesInfo = getGenomeInfo(state);
  return allGenomesInfo[genomeId] || null;
};

export const getGenomeInfoFetching = (state: RootState) =>
  state.genome.genomeInfo.genomeInfoFetching;

export const getGenomeInfoFetchFailed = (state: RootState) =>
  state.genome.genomeInfo.genomeInfoFetchFailed;

export const getGenomeTrackCategories = (state: RootState) =>
  state.genome.genomeTrackCategories.genomeTrackCategoriesData;

export const getGenomeExampleFocusObjects = (
  state: RootState,
  genomeId: string | null
) => {
  const emptyObjects: never[] = [];
  if (!genomeId) {
    return emptyObjects;
  }
  return (
    state.genome.genomeInfo.genomeInfoData[genomeId]?.example_objects ||
    emptyObjects
  );
};

export const getGenomeTrackCategoriesById = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return activeGenomeId
    ? state.genome.genomeTrackCategories.genomeTrackCategoriesData[
        activeGenomeId
      ]
    : null;
};

export const getGenomeTrackCategoriesFetching = (state: RootState) =>
  state.genome.genomeTrackCategories.genomeTrackCategoriesFetching;

export const getGenomeTrackCategoriesFetchFailed = (state: RootState) =>
  state.genome.genomeTrackCategories.genomeTrackCategoriesFetchFailed;

export const getGenomeKaryotype = (state: RootState) => {
  const activeGenomeId = getBrowserActiveGenomeId(state);
  return activeGenomeId
    ? state.genome.genomeKaryotype.genomeKaryotypeData[activeGenomeId]
    : null;
};

export const getKaryotypeItemLength = (name: string, state: RootState) => {
  const karyotype = getGenomeKaryotype(state);
  if (!karyotype) {
    return null;
  }

  const karyotypeItem = karyotype.find((item) => item.name === name);
  return karyotypeItem ? karyotypeItem.length : null;
};

export const getGenomeKaryotypeFetching = (state: RootState) =>
  state.genome.genomeKaryotype.genomeKaryotypeFetching;

export const getGenomeKaryotypeFetchFailed = (state: RootState) =>
  state.genome.genomeKaryotype.genomeKaryotypeFetchFailed;
