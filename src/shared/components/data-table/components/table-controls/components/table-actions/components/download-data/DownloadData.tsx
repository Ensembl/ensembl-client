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
import ReactDOM from 'react-dom/client';
import { memoize } from 'lodash';

import useDataTable from 'src/shared/components/data-table/hooks/useDataTable';
import { downloadTextAsFile } from 'src/shared/helpers/downloadAsFile';

import LoadingButton from 'src/shared/components/loading-button';

import { TableAction } from 'src/shared/components/data-table/dataTableTypes';

import styles from './DownloadData.scss';

const getReactRenderer = memoize(() => {
  const element = document.createElement('div');
  const root = ReactDOM.createRoot(element);

  return {
    element,
    renderer: root
  };
});

const getReactNodeText = (node: ReactNode): string => {
  const { element, renderer } = getReactRenderer();
  renderer.render(node);
  return element.innerText;
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

  const handleDownload = async () => {
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

  const onSuccess = () => {
    // show the green tick momentarily before we close it
    setTimeout(onCancel, 1000);
  };

  return (
    <div className={styles.downloadData}>
      <span>{downloadFileName ?? 'table.csv'}</span>
      <LoadingButton onClick={handleDownload} onSuccess={onSuccess}>
        Download
      </LoadingButton>
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
