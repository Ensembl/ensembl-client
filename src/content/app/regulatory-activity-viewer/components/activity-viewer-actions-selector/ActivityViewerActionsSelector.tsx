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

import { useState, useRef, type ChangeEvent } from 'react';
import classNames from 'classnames';

import { useAppDispatch } from 'src/store';

import useOutsideClick from 'src/shared/hooks/useOutsideClick';

import useActivityViewerIds from 'src/content/app/regulatory-activity-viewer/hooks/useActivityViewerIds';
import useEpigenomes from 'src/content/app/regulatory-activity-viewer/hooks/useEpigenomes';

import { setSortingDimensionsOrder } from 'src/content/app/regulatory-activity-viewer/state/epigenome-selection/epigenomeSelectionSlice';

import SimpleSelect, {
  type SimpleSelectMethods
} from 'src/shared/components/simple-select/SimpleSelect';

import ArrowUpIcon from 'static/icons/icon_arrow.svg';

import styles from './ActivityViewerActionsSelector.module.css';

/**
 * This component looks similar to the 'actions' selector at the top of some of the tables.
 *
 * NOTE:
 * The panel with options displayed at the bottom of the select element
 * should probably be implemented as a `dialog` (better for focus management,
 * enables focus trapping); but then, it would probably require
 * css anchor positioning, which is not yet supported by all browsers.
 * Such a panel will be a good candidate to be extracted into a dedicated FloatingDialog component.
 */

const Actions = {
  sorting: 'sorting',
  combineEpigenomes: 'combine-epigenomes'
} as const;

type CurrentAction = (typeof Actions)[keyof typeof Actions];

const ActivityViewerActionSelector = () => {
  const [action, setAction] = useState<CurrentAction | null>(null);
  const selectRef = useRef<SimpleSelectMethods>(null);

  const onActionSelected = (event: ChangeEvent<HTMLSelectElement>) => {
    const action = event.target.value as CurrentAction;
    setAction(action);
  };

  const resetAction = () => {
    setAction(null);
    selectRef.current?.clear();
  };

  const options = [
    {
      label: 'Show/hide columns',
      value: Actions.combineEpigenomes
    },
    {
      label: 'Reorder epigenomes',
      value: Actions.sorting
    }
  ];

  return (
    <div className={styles.selectContainer}>
      <SimpleSelect
        options={options}
        placeholder="Actions"
        defaultValue=""
        onInput={onActionSelected}
        ref={selectRef}
      />
      <FurtherOptions mode={action} onClose={resetAction} />
    </div>
  );
};

const FurtherOptions = ({
  mode,
  onClose
}: {
  mode: CurrentAction | null;
  onClose: () => void;
}) => {
  if (mode === 'sorting') {
    return <SortingOrder onClose={onClose} />;
  }

  return null;
};

const SortingOrder = ({ onClose }: { onClose: () => void }) => {
  const { activeGenomeId } = useActivityViewerIds();
  const {
    allEpigenomeSortableDimensions,
    epigenomeMetadataDimensionsResponse
  } = useEpigenomes();
  const panelRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  useOutsideClick(panelRef, onClose);

  if (
    !activeGenomeId ||
    !epigenomeMetadataDimensionsResponse ||
    !allEpigenomeSortableDimensions
  ) {
    // this should not happen
    return null;
  }

  const onRankChange = (index: number, direction: 'up' | 'down') => {
    const newDimensionsOrder = [...allEpigenomeSortableDimensions];
    const dimensionAtIndex = newDimensionsOrder[index];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const dimensionToSwap = newDimensionsOrder[newIndex];

    // switch dimensions
    newDimensionsOrder[newIndex] = dimensionAtIndex;
    newDimensionsOrder[index] = dimensionToSwap;

    dispatch(
      setSortingDimensionsOrder({
        genomeId: activeGenomeId,
        dimensionNames: newDimensionsOrder
      })
    );
  };

  const { dimensions } = epigenomeMetadataDimensionsResponse;

  return (
    <div className={styles.floatingPanel} ref={panelRef}>
      {allEpigenomeSortableDimensions.map((dimensionId, index) => (
        <div className={styles.sortableEpigenomeDimension} key={dimensionId}>
          <div className={styles.buttons}>
            <button
              onClick={() => onRankChange(index, 'up')}
              disabled={index === 0}
            >
              <ArrowUpIcon className={styles.sortArrow} />
            </button>
            <button
              onClick={() => onRankChange(index, 'down')}
              disabled={index === allEpigenomeSortableDimensions.length - 1}
            >
              <ArrowUpIcon
                className={classNames(styles.sortArrow, styles.sortArrowDown)}
              />
            </button>
          </div>
          <div
            className={
              index >= 3 ? styles.sortableDimensionLabelInactive : undefined
            }
          >
            {dimensions[dimensionId].name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityViewerActionSelector;
