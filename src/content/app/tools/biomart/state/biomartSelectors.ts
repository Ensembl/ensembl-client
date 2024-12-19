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

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/store';
import {
  BiomartFilter,
  BiomartFilterNumberType,
  BiomartGeneFilters,
  BiomartRegionFilters,
  BiomartTable
} from 'src/content/app/tools/biomart/state/biomartSlice';

export const selectedColumnsCount = createSelector(
  (state: RootState) => state.biomart.general.columnSelectionData,
  (columnSelectionData: BiomartTable[]) => {
    if (!Array.isArray(columnSelectionData)) {
      return 0;
    }
    return columnSelectionData.reduce((count, table) => {
      return count + table.options.filter((option) => option.checked).length;
    }, 0);
  }
);

const isCoordinatesChanged = (
  coordinates: BiomartFilterNumberType | undefined
) => {
  return (
    coordinates &&
    coordinates.output &&
    coordinates.output.length > 0 &&
    (coordinates.output[0] !== coordinates.input[0] ||
      coordinates.output[1] !== coordinates.input[1])
  );
};

const isRegionFilterActive = (
  filter: BiomartRegionFilters,
  data: BiomartFilter
) => {
  return (
    data.region &&
    data.region[filter] &&
    data.region[filter]?.output &&
    data.region[filter].output.length > 0
  );
};

const isGeneFilterActive = (
  filter: BiomartGeneFilters,
  data: BiomartFilter
) => {
  return (
    data.gene &&
    data.gene[filter] &&
    data.gene[filter]?.output &&
    data.gene[filter].output.length > 0
  );
};

export const selectedFiltersCount = createSelector(
  (state: RootState) => state.biomart.general.filterData,
  (filterData) => {
    let count = 0;

    if (!filterData) {
      return count;
    }

    if (isRegionFilterActive('chromosomes', filterData)) {
      count++;
    }

    if (
      filterData.region &&
      isCoordinatesChanged(filterData.region.coordinates)
    ) {
      count++;
    }

    if (isGeneFilterActive('gene_types', filterData)) {
      count++;
    }

    if (isGeneFilterActive('gene_sources', filterData)) {
      count++;
    }

    if (isGeneFilterActive('transcript_types', filterData)) {
      count++;
    }

    if (isGeneFilterActive('transcript_sources', filterData)) {
      count++;
    }

    if (isGeneFilterActive('gene_stable_id', filterData)) {
      count++;
    }

    if (isGeneFilterActive('transcript_stable_id', filterData)) {
      count++;
    }

    return count;
  }
);

export const columnSelectionData = (state: RootState) =>
  state.biomart.general.columnSelectionData;
export const filterData = (state: RootState) =>
  state.biomart.general.filterData;
