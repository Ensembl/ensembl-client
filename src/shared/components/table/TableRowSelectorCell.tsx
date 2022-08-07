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

import Checkbox from 'src/shared/components/checkbox/Checkbox';

import styles from './Table.scss';

/**
 * Responsibilities
 * - render a td tag containing either a checkbox or an eye icon, to act as a way to select a row
 */

type Props = {
  isSelected: boolean;
  mode: 'default' | 'selecting';
  onChange: () => void;
};

const TableRowSelectorCell = (props: Props) => {
  const { isSelected, onChange } = props;

  return (
    <td className={styles.tableCell}>
      <Checkbox checked={isSelected} onChange={onChange} />
    </td>
  );
};

export default TableRowSelectorCell;
