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

import React, { HTMLProps } from 'react';
import classNames from 'classnames';

import IconArrow from 'static/icons/icon_arrow.svg';

import styles from './Table.scss';

/**
 * Responsibilities
 * - render the th tag
 * - know about whether it is determining the sorting order in this column
 * - know the direction of the sorting order
 * - have a callback for sort
 */

type SortDirection = 'asc' | 'desc';

type MinimalProps = HTMLProps<HTMLTableCellElement>;

type SortableProps = MinimalProps & {
  sortDirection: SortDirection;
  onSortDirectionChange: (direction: SortDirection) => void;
  isSortingActive: boolean;
};

type Props = MinimalProps | SortableProps;

const TableHeadCell = (props: Props) => {
  if ('sortDirection' in props) {
    return <SortableTableHeadCell {...props} />;
  }
  const { children } = props;

  return <th className={styles.tableHeadCell}>{children}</th>;
};

const SortableTableHeadCell = (props: SortableProps) => {
  const { sortDirection, onSortDirectionChange, isSortingActive, children } =
    props;

  const onIconClick = () => {
    const nextDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    onSortDirectionChange(nextDirection);
  };

  const cellClasses = classNames(
    styles.tableHeadCell,
    styles.tableHeadCellSortable,
    {
      [styles.tableHeadCellSortableActive]: isSortingActive
    }
  );

  const arrowClasses = classNames(styles.tableHeadCellSortingArrow, {
    [styles.tableHeadCellSortingArrowDown]: sortDirection === 'asc'
  });

  return (
    <th className={cellClasses}>
      <div className={styles.tableHeadCellSortingControls}>
        <IconArrow className={arrowClasses} onClick={onIconClick} />
      </div>
      {children}
    </th>
  );
};

const SortDirection = () => {
  return <div></div>;
};

export default TableHeadCell;
