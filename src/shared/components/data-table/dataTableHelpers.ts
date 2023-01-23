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

import type { TableRow } from './dataTableTypes';

// A helper function for tricking typescript into thinking
// that the table cell contains data of suggested type.
// Useful to avoid arguing with typescript inside of column sort functions.
export const getStructuredContentFromCellInRow = <T>(
  row: TableRow,
  columnIndex: number
) => {
  const cellData = (row.cells[columnIndex] as any).data as T;
  return cellData;
};
