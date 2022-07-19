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

import React from 'react';
import classNames from 'classnames';

import styles from 'src/shared/components/table/Table.scss';
/*
    - takes in the content that needs to be displayed within a cell
    - Wraps the content within a <td> tag
*/

type TableCellProps = React.DetailedHTMLProps<
  React.TdHTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>;
const TableCell = (props: TableCellProps) => {
  const cellClassNames = classNames(styles.cell, props.className);
  return (
    <td {...props} className={cellClassNames}>
      {props.children}
    </td>
  );
};

export default TableCell;
