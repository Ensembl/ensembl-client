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

import { useState } from 'react';

import { TRACK_HEIGHT } from 'src/content/app/regulatory-activity-viewer/components/epigenomes-activity/epigenomeActivityImageConstants';

import useEpigenomes from 'src/content/app/regulatory-activity-viewer/hooks/useEpigenomes';

import { displayEpigenomeValue } from 'src/content/app/regulatory-activity-viewer/components/selected-epigenomes/SelectedEpigenomes';

import { Table, ColumnHead } from 'src/shared/components/table/';
import CloseButton from 'src/shared/components/close-button/CloseButton';
import Chevron from 'src/shared/components/chevron/Chevron';

import type { EpigenomeMetadataDimensions } from 'src/content/app/regulatory-activity-viewer/types/epigenomeMetadataDimensions';

import styles from './EpigenomesTable.module.css';

type TableDisplayType = 'full' | 'partial';

const EpigenomesTableContainer = () => {
  const [displayType, setDisplayType] = useState<TableDisplayType | null>(null);

  const showPartialTable = () => {
    setDisplayType('partial');
  };

  // const showFullTable = () => {
  //   setDisplayType('full');
  // };

  const hideTable = () => {
    setDisplayType(null);
  };

  return (
    <div className={styles.container}>
      {displayType === null ? (
        <button
          className={styles.openButton}
          onClick={showPartialTable}
          aria-label="show table of epigenomes"
        >
          <Chevron direction="right" />
        </button>
      ) : (
        <div className={styles.tableContainer}>
          <EpigenomesTable displayType={displayType} />
          <CloseButton
            className={styles.closeButton}
            onClick={hideTable}
            aria-label="hide table of epigenomes"
          />
        </div>
      )}
    </div>
  );
};

/**
 * This component is very similar to the SelectedEpigenomes component.
 * One of its main difference is that it displays either the first three dimensions
 * (used to determine sorting order), or the full list of dimensions.
 *
 * Its another difference is that it limits the height of table rows
 * to the height of an epigenome activity track
 */
const EpigenomesTable = ({
  displayType
}: {
  displayType: TableDisplayType;
}) => {
  const {
    sortedCombinedEpigenomes,
    epigenomeSortingDimensions,
    allEpigenomeSortableDimensions,
    epigenomeMetadataDimensionsResponse
  } = useEpigenomes();

  if (
    !sortedCombinedEpigenomes ||
    !epigenomeMetadataDimensionsResponse ||
    !allEpigenomeSortableDimensions ||
    !epigenomeSortingDimensions?.length
  ) {
    return null;
  }

  const tableColumns = getTableColumns({
    sortingDimensionNames: epigenomeSortingDimensions,
    allTableDimensionNames:
      epigenomeMetadataDimensionsResponse.ui_spec.table_layout,
    metadataDimensions: epigenomeMetadataDimensionsResponse.dimensions,
    getShortList: displayType === 'partial'
  });

  // FIXME: consider collapsed dimensions

  return (
    <Table className={styles.table}>
      <thead>
        <tr>
          {tableColumns.map((tableColumn) => (
            <ColumnHead key={tableColumn.dimensionName}>
              {tableColumn.columnHeading}
            </ColumnHead>
          ))}
        </tr>
      </thead>
      <tbody>
        {sortedCombinedEpigenomes.map((epigenome) => (
          <tr key={epigenome.id}>
            {tableColumns.map((tableColumn) => (
              <td key={tableColumn.dimensionName}>
                <div
                  style={{
                    height: `calc(${TRACK_HEIGHT}px - 18px - 1px)`,
                    maxWidth: '150px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {displayEpigenomeValue(epigenome[tableColumn.dimensionName])}
                </div>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const getTableColumns = ({
  sortingDimensionNames,
  allTableDimensionNames,
  metadataDimensions,
  getShortList
}: {
  sortingDimensionNames: string[];
  allTableDimensionNames: string[];
  metadataDimensions: EpigenomeMetadataDimensions;
  getShortList: boolean;
}): { dimensionName: string; columnHeading: string }[] => {
  let dimensionNames: string[] = [];

  if (getShortList) {
    dimensionNames = sortingDimensionNames;
  } else {
    const nonSortingDimensionNames = allTableDimensionNames.filter(
      (name) => !sortingDimensionNames.includes(name)
    );
    dimensionNames = sortingDimensionNames.concat(...nonSortingDimensionNames);
  }

  return dimensionNames.map((dimensionName) => ({
    dimensionName,
    columnHeading: metadataDimensions[dimensionName].name
  }));
};

export default EpigenomesTableContainer;
