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
import type { EpigenomeMetadataDimensions } from 'src/content/app/regulatory-activity-viewer/types/epigenomeMetadataDimensions';
import type { EpigenomeSelectionCriteria } from 'src/content/app/regulatory-activity-viewer/state/epigenome-selection/epigenomeSelectionSelectors';

type Params = {
  activeMetadataDimension: string | null; // user is interacting with metadata items in this dimension
  selectionCriteria: EpigenomeSelectionCriteria;
  epigenomes: Epigenome[];
};

type Counts = {
  [metadataDimension: string]: {
    [metadataName: string]: number;
  };
};

/**
 * - If no filters, return total counts
 * - Apply filters for dimensions, excluding the current dimension
 */

const getEpigenomeCounts = (params: Params) => {
  const epigenomes = hasAppliedFilters(params.selectionCriteria)
    ? filterEpigenomes(params)
    : params.epigenomes;
  const counts: Counts = {};

  if (!epigenomes.length) {
    return counts;
  }

  // out of the fields that an epigenome may have, the 'id' field is unique per epigenome,
  // and makes no sense to count
  const epigenomeCountableFields = Object.keys(epigenomes[0]).filter(
    (fieldName) => fieldName !== 'id'
  );

  for (const epigenome of epigenomes) {
    for (const field of epigenomeCountableFields) {
      if (!counts[field]) {
        counts[field] = {};
      }
      const valueForField = epigenome[field as keyof Epigenome];
      // Since epigenome field values can be either strings or arrays of strings,
      // turn all values into arrays of strings
      const values =
        typeof valueForField === 'string' ? [valueForField] : valueForField;

      for (const value of values) {
        if (!counts[field][value]) {
          counts[field][value] = 1;
        } else {
          counts[field][value] += 1;
        }
      }
    }
  }

  return counts;
};

const hasAppliedFilters = (selectionCriteria: Params['selectionCriteria']) => {
  for (const filtersSet of Object.values(selectionCriteria)) {
    if (filtersSet.size) {
      return true;
    }
  }
  return false;
};

export const getMetadataItems = (params: {
  dimensionName: keyof EpigenomeMetadataDimensions;
  metadataItems: EpigenomeMetadataDimensions[keyof EpigenomeMetadataDimensions];
  selectionCriteria: EpigenomeSelectionCriteria;
  epigenomes: Epigenome[];
}) => {
  const { dimensionName, selectionCriteria } = params;
  const counts: Record<string, number> = {};

  // Filter out epigenomes applying to them filters from the dimension other than the current one
  const filteredEpigenomes = filterEpigenomes({
    selectionCriteria,
    epigenomes: params.epigenomes,
    activeMetadataDimension: dimensionName
  });

  for (const epigenome of filteredEpigenomes) {
    let metadata = epigenome[dimensionName as keyof typeof epigenome];
    if (!metadata) {
      continue;
    } else if (typeof metadata === 'string') {
      metadata = [metadata];
    }

    for (const item of metadata) {
      const count = counts[item];
      if (!count) {
        counts[item] = 1;
      } else {
        counts[item] += 1;
      }
    }
  }

  const metadataItems = params.metadataItems.values.filter((item) => {
    if (typeof item === 'string') {
      return counts[item] || selectionCriteria[dimensionName]?.has(item);
    } else {
      return (
        'name' in item &&
        (counts[item.name] || selectionCriteria[dimensionName]?.has(item.name))
      );
    }
  });

  return {
    metadataItems: {
      name: params.metadataItems.name,
      values: metadataItems
    } as EpigenomeMetadataDimensions[keyof EpigenomeMetadataDimensions],
    counts
  };
};

const filterEpigenomes = (params: Params) => {
  const { activeMetadataDimension, selectionCriteria, epigenomes } = params;
  const selectedMetadataDimensions = Object.keys(selectionCriteria).filter(
    (dimension) => dimension !== activeMetadataDimension
  );
  if (!selectedMetadataDimensions.length) {
    return epigenomes;
  }

  let filteredEpigenomes: typeof epigenomes = epigenomes;
  let currentFilteredEpigenomes = [];

  for (const dimension of selectedMetadataDimensions) {
    for (const epigenome of filteredEpigenomes) {
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
    filteredEpigenomes = currentFilteredEpigenomes;
    currentFilteredEpigenomes = [];
  }

  return filteredEpigenomes;
};

export default getEpigenomeCounts;
