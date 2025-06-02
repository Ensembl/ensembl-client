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

import { useState, useEffect } from 'react';

import { TRACK_HEIGHT } from 'src/content/app/regulatory-activity-viewer/components/epigenomes-activity/epigenomeActivityImageConstants';

import useEpigenomes from 'src/content/app/regulatory-activity-viewer/hooks/useEpigenomes';

import { tableVisibility$, updateTableState } from './epigenomesTableState';
import { displayEpigenomeValue } from 'src/content/app/regulatory-activity-viewer/components/selected-epigenomes/SelectedEpigenomes';
import { getEpigenomeLabels } from 'src/content/app/regulatory-activity-viewer/components/selected-epigenomes/epigenomes-sorter/EpigenomeLabels';

import { Table, ColumnHead } from 'src/shared/components/table';
import TextButton from 'src/shared/components/text-button/TextButton';

import type { EpigenomeMetadataDimensions } from 'src/content/app/regulatory-activity-viewer/types/epigenomeMetadataDimensions';

import styles from './EpigenomesTable.module.css';

type TableDisplayType = 'full' | 'partial';

const EpigenomesTableContainer = () => {
  const [displayType, setDisplayType] = useState<TableDisplayType | null>(
    'partial'
  );

  const showPartialTable = () => {
    setDisplayType('partial');
  };

  const showFullTable = () => {
    setDisplayType('full');
  };

  const hideTable = () => {
    setDisplayType(null);
  };

  useEffect(() => {
    updateTableState({ isAvailable: true });

    return () => {
      updateTableState({ isAvailable: false });
    };
  }, []);

  useEffect(() => {
    const subscription = tableVisibility$.subscribe((state) => {
      if (state.isOpen) {
        showPartialTable();
      } else {
        hideTable();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (displayType === null) {
    return null;
  }

  return (
    <div className={styles.container}>
      <EpigenomesTable
        displayType={displayType}
        showFullTable={showFullTable}
      />
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
  displayType,
  showFullTable
}: {
  displayType: TableDisplayType;
  showFullTable: () => void;
}) => {
  const {
    sortedCombinedEpigenomes,
    epigenomeSortingDimensions,
    allEpigenomeSortableDimensions,
    epigenomeMetadataDimensionsResponse,
    epigenomeCombiningDimensions
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

  const isCombiningDimension = (dimension: string) => {
    return epigenomeCombiningDimensions.includes(dimension);
  };

  // FIXME: consider collapsed dimensions

  const colorLabels = getEpigenomeLabels({
    epigenomes: sortedCombinedEpigenomes,
    sortingDimensions: epigenomeSortingDimensions
  });

  return (
    <Table className={styles.table}>
      <thead>
        <tr>
          {tableColumns.map((tableColumn) => {
            if (isCombiningDimension(tableColumn.dimensionName)) {
              return null;
            }
            return (
              <ColumnHead key={tableColumn.dimensionName}>
                {tableColumn.columnHeading}
              </ColumnHead>
            );
          })}
          {displayType === 'partial' && (
            <ColumnHead>
              <TextButton onClick={showFullTable}>Show more</TextButton>
            </ColumnHead>
          )}
        </tr>
      </thead>
      <tbody>
        {sortedCombinedEpigenomes.map((epigenome, rowIndex) => (
          <tr key={epigenome.id}>
            {tableColumns.map((tableColumn, columnIndex) => {
              if (isCombiningDimension(tableColumn.dimensionName)) {
                return null;
              }

              return (
                <td key={tableColumn.dimensionName}>
                  <div
                    className={styles.tableCellContent}
                    style={{
                      height: `calc(${TRACK_HEIGHT}px - 18px - 1px)` // track height minus vertical cell padding, minus table border height
                    }}
                  >
                    <ColorLabel
                      color={colorLabels[rowIndex]?.[columnIndex]?.color}
                    />
                    <span>
                      {displayEpigenomeValue(
                        epigenome[tableColumn.dimensionName]
                      )}
                    </span>
                  </div>
                </td>
              );
            })}
            {displayType === 'partial' && <td />}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

const ColorLabel = ({ color }: { color?: string }) => {
  if (!color) {
    return null;
  }

  return (
    <span className={styles.colorLabel} style={{ backgroundColor: color }} />
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
