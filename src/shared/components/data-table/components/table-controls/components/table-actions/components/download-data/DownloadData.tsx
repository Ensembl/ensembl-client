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
import React, { ReactNode } from 'react';

import { TableAction } from 'src/shared/components/data-table/dataTableTypes';
import useDataTable from 'src/shared/components/data-table/hooks/useDataTable';

import { PrimaryButton } from 'src/shared/components/button/Button';

import styles from './DownloadData.scss';
import { downloadTextAsFile } from 'src/shared/helpers/downloadAsFile';

const getReactNodeText = (node: ReactNode): string => {
  if (['string', 'number'].includes(typeof node)) {
    return node?.toString() || '';
  }

  if (typeof node === 'object' && node && 'props' in node) {
    return getReactNodeText(node.props.children);
  }

  return '';
};

const DownloadData = () => {
  const {
    dispatch,
    rows,
    downloadFileName,
    columns,
    selectedAction,
    hiddenRowIds,
    downloadHandler
  } = useDataTable();

  const onCancel = () => {
    dispatch({
      type: 'set_selected_action',
      payload: TableAction.DEFAULT
    });
  };

  const handleDownload = () => {
    if (downloadHandler) {
      downloadHandler();
      return;
    }
    const dataForExport: string[][] = [];
    dataForExport[0] = [
      ...columns
        .filter((column) => column.isExportable !== false)
        .map((column) => column.title ?? '')
    ];

    const rowsToDownload =
      selectedAction === TableAction.DOWNLOAD_ALL_DATA
        ? rows
        : rows.filter((row) => !hiddenRowIds[row.rowId]);

    rowsToDownload.forEach((row, rowIndex) => {
      dataForExport[rowIndex + 1] = [];
      row.cells.forEach((cell, cellIndex) => {
        const { renderer, isExportable } = columns[cellIndex];

        if (isExportable !== false) {
          const cellExportData = renderer
            ? renderer({
                rowData: row.cells,
                rowId: String(row.rowId),
                cellData: cell
              })
            : cell;

          dataForExport[rowIndex + 1].push(getReactNodeText(cellExportData));
        }
      });
    });

    const csv = formatCSV(dataForExport);

    downloadTextAsFile(csv, downloadFileName ?? 'Table export.csv');
  };

  return (
    <div className={styles.downloadData}>
      <span>{downloadFileName ?? 'Table export.csv'}</span>
      <PrimaryButton onClick={handleDownload}>Download</PrimaryButton>
      <span className={styles.cancel} onClick={onCancel}>
        cancel
      </span>
    </div>
  );
};

const formatCSV = (table: (string | number)[][]) => {
  return table.map((row) => row.join(',')).join('\n');
};

export default DownloadData;