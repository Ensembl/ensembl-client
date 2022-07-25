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
import classNames from 'classnames';
import React, { useContext } from 'react';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';
import SelectArrowhead, {
  Direction
} from 'src/shared/components/select/SelectArrowhead';
import {
  IndividualColumn,
  SortingDirection
} from 'src/shared/components/table/state/tableReducer';
import { TableContext } from 'src/shared/components/table/Table';

import styles from '../../TableHeader.scss';

/*
    This is a component on its own as a cell in the header will have additional functionalities compared to a cell in the body.
    Additional functionalities includes:
        - Column tooltips
        - sorting chevrons
 */

const TableHeaderCell = (props: IndividualColumn) => {
  const { title, helpText, isSortable, columnId, width = '150px' } = props;

  const { dispatch, sortedColumn } = useContext(TableContext) || {};

  const { columnId: sortedColumnId, sortedDirection } = sortedColumn || {};

  if (!dispatch) {
    return null;
  }

  let currentColumnSortingDirection = Direction.DOWN;
  if (
    columnId === sortedColumnId &&
    sortedDirection &&
    sortedDirection === SortingDirection.ASC
  ) {
    currentColumnSortingDirection = Direction.UP;
  }

  const onSort = () => {
    let directionToSet = SortingDirection.DEFAULT;
    if (
      columnId !== sortedColumnId ||
      sortedDirection === SortingDirection.DEFAULT
    ) {
      directionToSet = SortingDirection.DESC;
    } else if (sortedDirection === SortingDirection.DESC) {
      directionToSet = SortingDirection.ASC;
    } else if (sortedDirection === SortingDirection.ASC) {
      dispatch({
        type: 'clear_sorted_column'
      });
      return;
    }

    dispatch({
      type: 'set_sorted_column',
      payload: {
        columnId,
        sortedDirection: directionToSet
      }
    });
  };

  const sortArrowClassNames = classNames(styles.sortArrow, {
    [styles.sortArrowActive]: columnId === sortedColumnId
  });

  const headerCellClassNames = classNames(styles.headerCell, {
    [styles.headerCellSortable]: isSortable
  });

  return (
    <th className={headerCellClassNames} style={{ width: width }}>
      <div className={styles.headerCellContent} onClick={() => onSort()}>
        {isSortable && (
          <span className={sortArrowClassNames}>
            <SelectArrowhead direction={currentColumnSortingDirection} />
          </span>
        )}

        <span>{title}</span>
        {helpText && (
          <QuestionButton
            helpText={helpText}
            className={{ inline: styles.questionButton }}
          />
        )}
      </div>
    </th>
  );
};

export default TableHeaderCell;
