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

import { memo } from 'react';
import { useAppSelector } from 'src/store';

import useEpigenomes from 'src/content/app/regulatory-activity-viewer/hooks/useEpigenomes';

import { getEpigenomeCombiningDimensions } from 'src/content/app/regulatory-activity-viewer/state/epigenome-selection/epigenomeSelectionSelectors';

import { Table, ColumnHead } from 'src/shared/components/table/';
import { getEpigenomeLabels } from './epigenomes-sorter/EpigenomeLabels';

import type { EpigenomeMetadataDimensionsResponse } from 'src/content/app/regulatory-activity-viewer/types/epigenomeMetadataDimensions';
import type { Epigenome } from 'src/content/app/regulatory-activity-viewer/types/epigenome';

import styles from './SelectedEpigenomes.module.css';

type Props = {
  genomeId: string;
};

const SelectedEpigenomes = (props: Props) => {
  const { genomeId } = props;
  const {
    sortedCombinedEpigenomes,
    epigenomeSortingDimensions,
    epigenomeMetadataDimensionsResponse
  } = useEpigenomes();
  const epigenomeCombiningDimensions = useAppSelector((state) =>
    getEpigenomeCombiningDimensions(state, genomeId)
  );

  if (
    !sortedCombinedEpigenomes ||
    !epigenomeMetadataDimensionsResponse ||
    !epigenomeSortingDimensions?.length
  ) {
    return null;
  }

  const tableColumns = getTableColumns(epigenomeMetadataDimensionsResponse);
  const epigenomeLabelsData = getEpigenomeLabels({
    epigenomes: sortedCombinedEpigenomes,
    sortingDimensions: epigenomeSortingDimensions
  });

  return (
    <div className={styles.outerGrid}>
      <div className={styles.mainColumn}>
        <Table className={styles.epigenomesTable}>
          <thead>
            <tr>
              <ColumnHead>Label</ColumnHead>
              {tableColumns.map((tableColumn) =>
                !isDimensionCollapsed(
                  tableColumn.dimensionName,
                  epigenomeCombiningDimensions
                ) ? (
                  <ColumnHead key={tableColumn.dimensionName}>
                    {tableColumn.columnHeading}
                  </ColumnHead>
                ) : null
              )}
            </tr>
          </thead>
          <tbody>
            {sortedCombinedEpigenomes.map((epigenome, index) => (
              <tr key={index}>
                <td style={{ position: 'relative' }}>
                  <EpigenomeLabels
                    data={epigenomeLabelsData}
                    rowIndex={index}
                  />
                </td>
                {tableColumns.map(
                  (tableColumn) =>
                    !isDimensionCollapsed(
                      tableColumn.dimensionName,
                      epigenomeCombiningDimensions
                    ) && (
                      <td key={tableColumn.dimensionName}>
                        {displayEpigenomeValue(
                          epigenome[
                            tableColumn.dimensionName as keyof typeof epigenome
                          ]
                        )}
                      </td>
                    )
                )}
              </tr>
            ))}
          </tbody>
        </Table>
        {!sortedCombinedEpigenomes.length && (
          <div className={styles.noEpigenomesMessage}>
            Use 'Configure' to select the data to display
          </div>
        )}
      </div>
    </div>
  );
};

const isDimensionCollapsed = (
  dimensionName: string,
  collapsedDimensions: string[]
) => {
  return collapsedDimensions.includes(dimensionName);
};

export const displayEpigenomeValue = (value?: Epigenome[keyof Epigenome]) => {
  if (Array.isArray(value)) {
    return value.join(', ');
  } else if (typeof value === 'string') {
    return value;
  } else {
    return '-';
  }
};

const EpigenomeLabels = ({
  data,
  rowIndex
}: {
  data: ReturnType<typeof getEpigenomeLabels>;
  rowIndex: number;
}) => {
  const labelData = data[rowIndex];

  return (
    <div
      style={{
        display: 'flex',
        position: 'absolute',
        top: '2px',
        bottom: '2px',
        columnGap: '2px'
      }}
    >
      {labelData.map(({ color }, index) => (
        <div
          style={{ width: '5px', height: '100%', backgroundColor: color }}
          key={index}
        />
      ))}
    </div>
  );
};

const getTableColumns = (params: EpigenomeMetadataDimensionsResponse) => {
  const { ui_spec, dimensions } = params;

  return ui_spec.table_layout.map((dimensionName) => ({
    dimensionName,
    columnHeading: dimensions[dimensionName].name
  }));
};

export default memo(SelectedEpigenomes);
