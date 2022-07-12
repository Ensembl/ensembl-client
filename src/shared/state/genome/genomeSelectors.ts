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

import type { RootState } from 'src/store';
import type { GenomeInfo } from './genomeTypes';

export const getGenomeInfo = (state: RootState) => state.genome.genomes;

export const getGenomeInfoById = (
  state: RootState,
  genomeId: string
): GenomeInfo | null => {
  const allGenomesInfo = getGenomeInfo(state);
  return allGenomesInfo[genomeId] || null;
};

export const getGenomeIdFromUrlSlug = (
  state: RootState,
  urlSlug: string
): string | undefined => {
  return state.genome.urlToGenomeIdMap[urlSlug];
};

export const getGenomeInfoByUrlSlug = (
  state: RootState,
  urlSlug: string
): GenomeInfo | null => {
  const genomeId = getGenomeIdFromUrlSlug(state, urlSlug);
  return genomeId ? getGenomeInfoById(state, genomeId) : null;
};

export const getGenomeIdForUrl = (
  state: RootState,
  genomeId: string
): string | undefined => {
  const genome = getGenomeInfoById(state, genomeId);
  return genome?.url_slug ?? genome?.genome_id;
};

export const getGenomeExampleFocusObjects = (
  state: RootState,
  genomeId: string | null
) => {
  const emptyObjects: never[] = [];
  if (!genomeId) {
    return emptyObjects;
  }
  return state.genome.genomes[genomeId]?.example_objects || emptyObjects;
};
