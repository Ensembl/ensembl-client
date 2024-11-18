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
import { BiomartTable } from 'src/content/app/tools/biomart/state/biomartSlice';

export const selectSelectedColumnsCount = createSelector(
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

export const columnSelectionData = (state: RootState) =>
  state.biomart.general.columnSelectionData;
export const filterData = (state: RootState) =>
  state.biomart.general.filterData;
