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

import { useCallback } from 'react';
import classNames from 'classnames';

import { useAppDispatch } from 'src/store';

import useEpigenomes from 'src/content/app/regulatory-activity-viewer/hooks/useEpigenomes';

import { setSortingDimensionsOrder } from 'src/content/app/regulatory-activity-viewer/state/epigenome-selection/epigenomeSelectionSlice';

import ArrowUpIcon from 'static/icons/icon_arrow.svg';

import styles from './EpigenomesOrderConfigurator.module.css';

/**
 * Interface for combining the epigenomes,
 * and for determining the sorting order of epigenomes
 */

type Props = {
  genomeId: string;
};

const EpigenomesOrderConfigurator = (props: Props) => {
  const { genomeId } = props;
  const {
    allEpigenomeSortableDimensions,
    epigenomeMetadataDimensionsResponse
  } = useEpigenomes();
  const dispatch = useAppDispatch();

  const onRankChange = useCallback(
    (dimension: string, direction: 'up' | 'down') => {
      const newDimensionsOrder = [...allEpigenomeSortableDimensions];
      const oldIndex = newDimensionsOrder.indexOf(dimension);
      const newIndex = direction === 'up' ? oldIndex - 1 : oldIndex + 1;
      const dimensionToSwap = newDimensionsOrder[newIndex];

      // switch dimensions
      newDimensionsOrder[newIndex] = dimension;
      newDimensionsOrder[oldIndex] = dimensionToSwap;

      dispatch(
        setSortingDimensionsOrder({
          genomeId,
          dimensionNames: newDimensionsOrder
        })
      );
    },
    [genomeId, allEpigenomeSortableDimensions]
  );

  if (!epigenomeMetadataDimensionsResponse || !allEpigenomeSortableDimensions) {
    // this should not happen
    return null;
  }

  return (
    <div>
      <ExplanatoryNote />
      {allEpigenomeSortableDimensions.map((dimensionId, index) => (
        <DimensionPanel
          key={dimensionId}
          dimensionId={dimensionId}
          isFirst={index === 0}
          isLast={index === allEpigenomeSortableDimensions.length - 1}
          dimensionName={
            epigenomeMetadataDimensionsResponse.dimensions[dimensionId].name
          }
          onRankChange={onRankChange}
        />
      ))}
    </div>
  );
};

const ExplanatoryNote = () => {
  return (
    <p className={styles.note}>
      Epigenomes are sorted by the values of the below dimensions. The dimension
      at the top of the list is used for sorting first; then the following two
      dimensions are be used to break the ties.
    </p>
  );
};

const DimensionPanel = ({
  dimensionId,
  dimensionName,
  isFirst,
  isLast,
  onRankChange
}: {
  dimensionId: string;
  dimensionName: string;
  isFirst: boolean;
  isLast: boolean;
  onRankChange: (dimension: string, direction: 'up' | 'down') => void;
}) => {
  return (
    <div className={styles.dimensionPanel}>
      <div>{dimensionName}</div>
      <div className={styles.sortButtons}>
        <button
          onClick={() => onRankChange(dimensionId, 'up')}
          aria-label="Increase sort order"
          disabled={isFirst}
        >
          <ArrowUpIcon className={styles.sortArrow} />
        </button>
        <button
          onClick={() => onRankChange(dimensionId, 'down')}
          aria-label="Decrease sort order"
          disabled={isLast}
        >
          <ArrowUpIcon
            className={classNames(styles.sortArrow, styles.sortArrowDown)}
          />
        </button>
      </div>
    </div>
  );
};

export default EpigenomesOrderConfigurator;
