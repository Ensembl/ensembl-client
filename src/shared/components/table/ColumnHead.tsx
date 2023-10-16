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

import React, { DetailedHTMLProps, ThHTMLAttributes } from 'react';
import classNames from 'classnames';

import SortIcon from 'static/icons/icon_arrow.svg';

import styles from './ColumnHead.scss';

type SortOrder = 'none' | 'asc' | 'desc';

type RegularColumnHeadProps = DetailedHTMLProps<
  ThHTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>;

type SortableColumnHeadProps = RegularColumnHeadProps & {
  sortOrder: SortOrder;
  onSortOrderChange: (order: SortOrder) => void;
};

type Props = RegularColumnHeadProps | SortableColumnHeadProps;

const ColumnHead = (props: Props) => {
  if (!('sortOrder' in props)) {
    return <th {...props} className={styles.columnHead} />;
  }

  const { sortOrder, onSortOrderChange, children } = props;
  const isSortingApplied = props.sortOrder !== 'none';

  const changeSortingOrder = () => {
    const nextOrder: SortOrder =
      sortOrder === 'none' ? 'desc' : sortOrder === 'desc' ? 'asc' : 'none';

    onSortOrderChange(nextOrder);
  };

  const componentClasses = classNames(
    styles.columnHead,
    styles.columnHeadSortable,
    {
      [styles.columnHeadSortingApplied]: isSortingApplied
    }
  );

  const sortIconClasses = classNames(styles.sortArrow, {
    [styles.sortArrowUp]: sortOrder === 'asc',
    [styles.sortArrowActive]: isSortingApplied
  });

  return (
    <th className={componentClasses}>
      <button onClick={changeSortingOrder}>
        <SortIcon className={sortIconClasses} />
        {children}
      </button>
    </th>
  );
};

export default ColumnHead;
