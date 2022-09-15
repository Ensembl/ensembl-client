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
import React, { useContext } from 'react';
import classNames from 'classnames';

import QuestionButton from 'src/shared/components/question-button/QuestionButton';

import { TableContext } from 'src/shared/components/data-table/DataTable';
import {
  type IndividualColumn,
  SortingDirection
} from 'src/shared/components/data-table/dataTableTypes';

import SortIcon from 'static/icons/icon_arrow.svg';

import styles from '../../TableHeader.scss';

const TableHeaderCell = (props: IndividualColumn) => {
  const { title, helpText, isSortable, columnId, width, headerCellClassName } =
    props;

  const { dispatch, sortedColumn } = useContext(TableContext) || {};

  const { columnId: sortedColumnId, sortedDirection } = sortedColumn || {};

  if (!dispatch) {
    return null;
  }

  let currentColumnSortingDirection = SortingDirection.NONE;
  if (columnId === sortedColumnId && sortedDirection === SortingDirection.ASC) {
    currentColumnSortingDirection = SortingDirection.ASC;
  }

  const onSort = () => {
    let directionToSet = SortingDirection.NONE;
    if (
      columnId !== sortedColumnId ||
      sortedDirection === SortingDirection.NONE
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
    [styles.sortArrowActive]: columnId === sortedColumnId,
    [styles.sortArrowUp]: currentColumnSortingDirection === SortingDirection.ASC
  });

  const headerCellClassNames = classNames(styles.headerCell, {
    [styles.headerCellSortable]: isSortable,
    headerCellClassName
  });

  const titleClassNames = classNames(styles.title, {
    [styles.titleSortable]: isSortable,
    [styles.titleActive]: columnId === sortedColumnId
  });

  const sortArrow = (
    <div
      onClick={isSortable ? onSort : undefined}
      className={styles.sortArrowContainer}
    >
      <SortIcon className={sortArrowClassNames} />
    </div>
  );

  return (
    <th className={headerCellClassNames} style={{ minWidth: width }}>
      <div className={styles.headerCellContent}>
        {isSortable && sortArrow}

        <span
          onClick={isSortable ? onSort : undefined}
          className={titleClassNames}
        >
          {title}
        </span>
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