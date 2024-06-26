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

import TableRow from '../table-row/TableRow';

import useDataTable from 'src/shared/components/data-table/hooks/useDataTable';

const TableBody = () => {
  const { getSortedCurrentPageRows } = useDataTable();

  // Filter the rows that needs to be displayed in the current page
  const rowsThisPage = getSortedCurrentPageRows();

  return (
    <tbody>
      {rowsThisPage.map((row, index) => {
        const { rowId } = row;
        return (
          <TableRow key={index} rowData={row.cells} rowId={rowId as string} />
        );
      })}
    </tbody>
  );
};

export default TableBody;
