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

import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import classNames from 'classnames';

import { useAppDispatch } from 'src/store';

import useOutsideClick from 'src/shared/hooks/useOutsideClick';

import useActivityViewerIds from 'src/content/app/regulatory-activity-viewer/hooks/useActivityViewerIds';
import useEpigenomes from 'src/content/app/regulatory-activity-viewer/hooks/useEpigenomes';

import {
  setSortingDimensionsOrder,
  setCombiningDimensions
} from 'src/content/app/regulatory-activity-viewer/state/epigenome-selection/epigenomeSelectionSlice';

import SimpleSelect, {
  type SimpleSelectMethods
} from 'src/shared/components/simple-select/SimpleSelect';
import CheckboxWithLabel from 'src/shared/components/checkbox-with-label/CheckboxWithLabel';

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

    // To prevent the floating panel from immediately closing,
    // because interaction with the select element is interpreted as an outside click,
    // set the action in the next tick
    setTimeout(() => {
      setAction(action);
    }, 0);
  };

  const resetAction = () => {
    setAction(null);
    selectRef.current?.clear();
  };

  const options = [
    {
      label: 'Distinguish epigenomes by',
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
        placeholder="Manage data display"
        defaultValue=""
        onChange={onActionSelected}
        disabled={action !== null}
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
  } else if (mode === 'combine-epigenomes') {
    return <DistinctEpigenomeDimensions onClose={onClose} />;
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

const DistinctEpigenomeDimensions = ({ onClose }: { onClose: () => void }) => {
  const { activeGenomeId } = useActivityViewerIds();
  const { epigenomeCombiningDimensions, epigenomeMetadataDimensionsResponse } =
    useEpigenomes();
  const allCombinableDimensions =
    epigenomeMetadataDimensionsResponse?.ui_spec.collapsible ?? [];
  const allDimensions = epigenomeMetadataDimensionsResponse?.dimensions;
  const dispatch = useAppDispatch();

  // To avoid rerendering large sections of the UI, keep the selection state locally
  // until user closes this component
  const [selectedDimensions, setSelectedDimensions] = useState(
    epigenomeCombiningDimensions
  );
  const panelRef = useRef<HTMLDivElement>(null);

  const selectedDimensionsRef = useRef(selectedDimensions);
  const combiningDimensionsRef = useRef(epigenomeCombiningDimensions);

  useOutsideClick(panelRef, onClose);

  // Counterintuitively, 'selecting' in the UI will be the exact opposite of 'selecting' in our code.
  // When user unticks ('deselects') a dimension, it means for us that we should 'select' this dimension
  // to use as a combining dimension
  const onChange = (dimension: string, isSelected: boolean) => {
    // if the isSelected flag is true, it means that the respective dimension should be treated as distinct.
    // Therefore, remove it from combined dimensions.
    const updatedDimensions = isSelected
      ? selectedDimensions.filter((dim) => dim !== dimension)
      : selectedDimensions.concat(dimension);
    setSelectedDimensions(updatedDimensions);
    selectedDimensionsRef.current = updatedDimensions;
  };

  useEffect(() => {
    return () => {
      const selectedDimensions = selectedDimensionsRef.current;
      const combiningDimensions = combiningDimensionsRef.current;

      const areDimensionArraysEqual =
        selectedDimensions.length === combiningDimensions.length &&
        selectedDimensions
          .toSorted()
          .every(
            (item, index) => item === combiningDimensions.toSorted()[index]
          );

      if (!areDimensionArraysEqual) {
        dispatch(
          setCombiningDimensions({
            genomeId: activeGenomeId as string,
            dimensionNames: selectedDimensions
          })
        );
      }
    };
  }, []);

  if (!allDimensions) {
    // this should not happen
    return null;
  }

  // Show dimensions in the list in the same order as the backend-directed order of columns in the table
  const sortedCombinableDimensions =
    epigenomeMetadataDimensionsResponse.ui_spec.table_layout
      .map((dimensionName) =>
        allCombinableDimensions.find((dim) => dim === dimensionName)
      )
      .filter((dim) => typeof dim === 'string');

  return (
    <div className={styles.floatingPanel} ref={panelRef}>
      {sortedCombinableDimensions.map((dimension) => (
        <div key={dimension}>
          <CheckboxWithLabel
            label={allDimensions[dimension].name}
            checked={!selectedDimensions.includes(dimension)}
            onChange={(isSelected) => onChange(dimension, isSelected)}
          />
        </div>
      ))}
    </div>
  );
};

export default ActivityViewerActionSelector;
