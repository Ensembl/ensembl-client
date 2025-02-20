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

import type { Epigenome } from 'src/content/app/regulatory-activity-viewer/types/epigenome';

export const filterEpigenomes = (params: {
  epigenomes: Epigenome[];
  selectionCriteria: Record<string, Set<string>>;
}) => {
  const { epigenomes, selectionCriteria } = params;
  const selectedMetadataDimensions = Object.keys(selectionCriteria);

  return applyFilters({
    epigenomes,
    selectionCriteria,
    selectedMetadataDimensions
  });
};

/**
 * This is a variation on the filterEpigenomes function,
 * with the difference being that it does not apply filters
 * within a provided dimension.
 * This is useful when displaying groups of filters in the UI -
 * enablling a filter should not hide other filters from the same group;
 * whereas in other groups, filters will only be shown that match epigenomes
 * which this filter also matches.
 * (I.e. visually, filters within a group act as an 'OR' logical operator,
 * while between groups, they act as an 'AND' logical operator.)
 */
export const filterEpigenomesWithDimensionExcluded = (params: {
  epigenomes: Epigenome[];
  selectionCriteria: Record<string, Set<string>>;
  dimensionToExclude: string;
}) => {
  const { dimensionToExclude, selectionCriteria, epigenomes } = params;
  const selectedMetadataDimensions = Object.keys(selectionCriteria).filter(
    (dimension) => dimension !== dimensionToExclude
  );

  return applyFilters({
    epigenomes,
    selectionCriteria,
    selectedMetadataDimensions
  });
};

const applyFilters = (params: {
  epigenomes: Epigenome[];
  selectionCriteria: Record<string, Set<string>>;
  selectedMetadataDimensions: string[]; // keys of selectionCriteria
}) => {
  const { epigenomes, selectionCriteria, selectedMetadataDimensions } = params;

  if (!selectedMetadataDimensions.length) {
    return epigenomes;
  }

  // Iterate over the groups of enabled filters (the selected metadata dimensions),
  // and gradually narrow down the list of epigenomes by applying filters from each subsequent group
  // to the results of the previous pass

  let finalFilteredEpigenomes = epigenomes;
  let currentFilteredEpigenomes: Epigenome[] = [];

  for (const dimension of selectedMetadataDimensions) {
    for (const epigenome of finalFilteredEpigenomes) {
      const metadata = epigenome[dimension as keyof typeof epigenome];
      if (typeof metadata === 'string') {
        if (selectionCriteria[dimension].has(metadata)) {
          currentFilteredEpigenomes.push(epigenome);
        }
      } else if (Array.isArray(metadata)) {
        for (const item of metadata) {
          if (selectionCriteria[dimension].has(item)) {
            currentFilteredEpigenomes.push(epigenome);
          }
        }
      }
    }
    finalFilteredEpigenomes = currentFilteredEpigenomes;
    currentFilteredEpigenomes = [];
  }

  return finalFilteredEpigenomes;
};
