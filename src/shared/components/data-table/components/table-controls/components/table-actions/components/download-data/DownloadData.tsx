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
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import memoize from 'lodash/memoize';

import useDataTable from 'src/shared/components/data-table/hooks/useDataTable';
import { downloadTextAsFile } from 'src/shared/helpers/downloadAsFile';

import { ControlledLoadingButton } from 'src/shared/components/loading-button';

import { TableAction } from 'src/shared/components/data-table/dataTableTypes';
import { LoadingState } from 'src/shared/types/loading-state';

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

  const [downloadState, setDownloadState] = useState<LoadingState>(
    LoadingState.NOT_REQUESTED
  );
  const allowComponentResetRef = useRef(true);

  useEffect(() => {
    allowComponentResetRef.current = true;
    return () => {
      allowComponentResetRef.current = false;
    };
  }, []);

  const restoreDefaults = () => {
    if (allowComponentResetRef.current) {
      dispatch({
        type: 'set_selected_action',
        payload: TableAction.DEFAULT
      });
    }
  };

  const handleDownload = async () => {
    setDownloadState(LoadingState.LOADING);
    if (downloadHandler) {
      try {
        await downloadHandler();
        setDownloadState(LoadingState.SUCCESS);
        setTimeout(restoreDefaults, 1000);
      } catch {
        setDownloadState(LoadingState.ERROR);
        setTimeout(() => {
          if (allowComponentResetRef.current) {
            setDownloadState(LoadingState.NOT_REQUESTED);
          }
        }, 2000);
      }

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

          if (typeof cellExportData === 'string') {
            dataForExport[rowIndex + 1].push(cellExportData);
          } else if (typeof cellExportData === 'number') {
            dataForExport[rowIndex + 1].push(String(cellExportData));
          } else {
            dataForExport[rowIndex + 1].push(getReactNodeText(cellExportData));
          }
        }
      });
    });

    const csv = formatCSV(dataForExport);

    downloadTextAsFile(csv, downloadFileName ?? 'Table export.csv');
    setDownloadState(LoadingState.SUCCESS);
    setTimeout(restoreDefaults, 1000);
  };

  return (
    <div className={styles.downloadData}>
      <span>{downloadFileName ?? 'table.csv'}</span>
      <ControlledLoadingButton status={downloadState} onClick={handleDownload}>
        Download
      </ControlledLoadingButton>
      <span className={styles.cancel} onClick={restoreDefaults}>
        cancel
      </span>
    </div>
  );
};

const formatCSV = (table: (string | number)[][]) => {
  return table.map((row) => row.join(',')).join('\n');
};

export default DownloadData;
