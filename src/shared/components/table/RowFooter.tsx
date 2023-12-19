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

import React, { useState, useEffect, useRef, type HTMLProps } from 'react';
import classNames from 'classnames';

import styles from './Table.module.css';

/**
 * The purpose of this component is to render a table row
 * with a single td element, which will span all columns
 * that are rendered by in the previous table row.
 *
 * The resulting effect is a single cell as wide as the table row itself.
 * The HTML element returned by this component will have a distinct class name,
 * which allows styling this row differently from regular tabel rows.
 *
 */

type Props = HTMLProps<HTMLTableCellElement>;

const RowFooter = (props: Props) => {
  const [colSpan, setColSpan] = useState<number | null>(null);
  const rowRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    const previousTableRow = rowRef.current?.previousSibling;
    if (!previousTableRow) {
      return;
    }

    const columnsCount = (
      previousTableRow as HTMLTableRowElement
    ).querySelectorAll('td').length;
    setColSpan(columnsCount);
  });

  const rowClassNames = classNames(styles.rowFooter);

  return (
    <tr ref={rowRef} className={rowClassNames}>
      {colSpan ? <td colSpan={colSpan}>{props.children}</td> : null}
    </tr>
  );
};

export default RowFooter;
