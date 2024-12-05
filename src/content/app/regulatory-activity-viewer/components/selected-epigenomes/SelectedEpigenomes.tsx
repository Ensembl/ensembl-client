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

import { useAppDispatch, useAppSelector } from 'src/store';

import { getCombinedEpigenomes } from 'src/content/app/regulatory-activity-viewer/components/selected-epigenomes/combineEpigenomes';

import {
  getEpigenomeSelectionCriteria,
  getEpigenomeCombiningDimensions
  // type EpigenomeSelectionCriteria
} from 'src/content/app/regulatory-activity-viewer/state/epigenome-selection/epigenomeSelectionSelectors';

import {
  addCombiningDimension,
  removeAllCombiningDimensions
} from 'src/content/app/regulatory-activity-viewer/state/epigenome-selection/epigenomeSelectionSlice';

import {
  useBaseEpigenomesQuery,
  useEpigenomeMetadataDimensionsQuery
} from 'src/content/app/regulatory-activity-viewer/state/api/activityViewerApiSlice';

import { Table, ColumnHead } from 'src/shared/components/table/';
import TextButton from 'src/shared/components/text-button/TextButton';

import type { EpigenomeMetadataDimensionsResponse } from 'src/content/app/regulatory-activity-viewer/types/epigenomeMetadataDimensions';
import type { Epigenome } from 'src/content/app/regulatory-activity-viewer/types/epigenome';

import styles from './SelectedEpigenomes.module.css';

const SelectedEpigenomes = () => {
  const { currentData: baseEpigenomes } = useBaseEpigenomesQuery();
  const { currentData: epigenomeMetadataDimensionsResponse } =
    useEpigenomeMetadataDimensionsQuery();
  const epigenomeSelectionCriteria = useAppSelector(
    getEpigenomeSelectionCriteria
  );
  const epigenomeCombiningDimensions = useAppSelector(
    getEpigenomeCombiningDimensions
  );
  const dispatch = useAppDispatch();

  const onCombiningDimensionAdded = (dimension: string) => {
    dispatch(addCombiningDimension(dimension));
  };

  const onRemoveAllCombiningDimensions = () => {
    dispatch(removeAllCombiningDimensions());
  };

  if (!baseEpigenomes || !epigenomeMetadataDimensionsResponse) {
    return null;
  }

  const filteredEpigenomes = applyFilters({
    epigenomes: baseEpigenomes,
    selectionCriteria: epigenomeSelectionCriteria
  });

  const combinedEpigenomes = getCombinedEpigenomes({
    baseEpigenomes: filteredEpigenomes,
    combiningDimensions: epigenomeCombiningDimensions
  });

  const epigenomesForDisplay = epigenomeCombiningDimensions.length
    ? combinedEpigenomes
    : filteredEpigenomes;

  const tableColumns = getTableColumns(epigenomeMetadataDimensionsResponse);

  // <EnabledFilters filters={epigenomeSelectionCriteria} />
  // <TextButton onClick={() => onCombiningDimensionAdded('sex')}>
  //   boop
  // </TextButton>

  return (
    <div className={styles.outerGrid}>
      <div className={styles.mainColumn}>
        <Table className={styles.epigenomesTable}>
          <thead>
            <tr>
              {tableColumns.map((tableColumn) =>
                !isDimensionCollapsed(
                  tableColumn.dimensionName,
                  epigenomeCombiningDimensions
                ) ? (
                  <ColumnHead key={tableColumn.dimensionName}>
                    {isCollapsibleDimension(
                      tableColumn.dimensionName,
                      epigenomeMetadataDimensionsResponse.dimensions
                    ) ? (
                      <TextButton
                        onClick={() =>
                          onCombiningDimensionAdded(tableColumn.dimensionName)
                        }
                      >
                        {tableColumn.columnHeading}
                      </TextButton>
                    ) : (
                      tableColumn.columnHeading
                    )}
                  </ColumnHead>
                ) : null
              )}
            </tr>
          </thead>
          <tbody>
            {epigenomesForDisplay.map((epigenome, index) => (
              <tr key={index}>
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
        {!epigenomesForDisplay.length && (
          <div className={styles.noEpigenomesMessage}>
            Use 'Configure' to select the data to display
          </div>
        )}
      </div>
      <div className={styles.rightColumn}>
        <EpigenomesCount epigenomes={epigenomesForDisplay} />
        <TextButton onClick={onRemoveAllCombiningDimensions}>
          Reset columns
        </TextButton>
      </div>
    </div>
  );
};

const isCollapsibleDimension = (
  dimensionName: string,
  dimensions: EpigenomeMetadataDimensionsResponse['dimensions']
) => {
  return dimensions[dimensionName]?.collapsible;
};

const isDimensionCollapsed = (
  dimensionName: string,
  collapsedDimensions: string[]
) => {
  return collapsedDimensions.includes(dimensionName);
};

const displayEpigenomeValue = (value?: Epigenome[keyof Epigenome]) => {
  if (Array.isArray(value)) {
    return value.join(', ');
  } else if (typeof value === 'string') {
    return value;
  } else {
    return null;
  }
};

/**
 * This component currently serves to output debug information;
 * but is quite likely to be transformed into something more user-friendly in the future.
 */
// const EnabledFilters = ({
//   filters
// }: {
//   filters: EpigenomeSelectionCriteria;
// }) => {
//   const filterDimensions = Object.keys(filters);

//   if (!filterDimensions.length) {
//     return null;
//   }

//   const appliedFilters = Object.entries(filters).map(
//     ([dimensionName, filters], index) => (
//       <span key={dimensionName}>
//         <span>{dimensionName}: </span>
//         <span>
//           {'['}
//           {[...filters].join(' OR ')}
//           {']'}
//         </span>
//         {index < filterDimensions.length - 1 && ' AND '}
//       </span>
//     )
//   );

//   return <div>Applied filters: {appliedFilters}</div>;
// };

const EpigenomesCount = ({ epigenomes }: { epigenomes: unknown[] }) => {
  const count = epigenomes.length;

  return (
    <div>
      <span className={styles.strong}>{count}</span> epigenomes
    </div>
  );
};

const getTableColumns = (params: EpigenomeMetadataDimensionsResponse) => {
  const { table_header_order, dimensions } = params;

  return table_header_order.map((dimensionName) => ({
    dimensionName,
    columnHeading: dimensions[dimensionName].name
  }));
};

// TODO: this function can probably be re-used with what is in getEpigenomeCounts
const applyFilters = (params: {
  epigenomes: Epigenome[];
  selectionCriteria: Record<string, Set<string>>;
}) => {
  const { epigenomes, selectionCriteria } = params;
  const selectedMetadataDimensions = Object.keys(selectionCriteria);

  if (!selectedMetadataDimensions.length) {
    return [];
  }

  let finalFilteredEpigenomes: typeof epigenomes = epigenomes;
  let currentFilteredEpigenomes: typeof epigenomes = [];

  for (const dimension of selectedMetadataDimensions) {
    for (const epigenome of finalFilteredEpigenomes) {
      const metadata = epigenome[dimension as keyof typeof epigenome];
      if (typeof metadata === 'string') {
        if (selectionCriteria[dimension].has(metadata)) {
          currentFilteredEpigenomes.push(epigenome);
        }
      } else if (Array.isArray(metadata)) {
        for (const item of metadata) {
          if (selectionCriteria[dimension].has(item)) {
            currentFilteredEpigenomes.push(epigenome);
          }
        }
      }
    }
    finalFilteredEpigenomes = currentFilteredEpigenomes;
    currentFilteredEpigenomes = [];
  }

  return finalFilteredEpigenomes;
};

export default SelectedEpigenomes;
