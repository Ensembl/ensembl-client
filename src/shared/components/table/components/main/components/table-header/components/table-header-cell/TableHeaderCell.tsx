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
import Chevron from 'src/shared/components/chevron/Chevron';
import QuestionButton from 'src/shared/components/question-button/QuestionButton';
import { IndividualColumn } from 'src/shared/components/table/state/tableReducer';
import { TableContext } from 'src/shared/components/table/Table';

import styles from '../../TableHeader.scss';

/*
    This is a component on its own as a cell in the header will have additional functionalities compared to a cell in the body.
    Additional functionalities includes:
        - Column tooltips
        - sorting chevrons
 */

const TableHeaderCell = (props: IndividualColumn) => {
  const { title, helpText, isSortable } = props;

  const { dispatch } = useContext(TableContext) || {};

  if (!dispatch) {
    return null;
  }

  // const onSort = () => {
  //   dispatch({
  //     type: "set_sorted_column",
  //     payload: {
  //       columnId,
  //       sortedDirection: SortingDirection.DEFAULT
  //     }
  //   })
  // }

  return (
    <th className={styles.headerCell}>
      <div className={styles.headerCellContent}>
        {isSortable && <Chevron direction="down"></Chevron>}

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
