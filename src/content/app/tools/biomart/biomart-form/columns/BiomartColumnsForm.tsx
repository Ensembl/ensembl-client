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

import Checkbox from 'src/shared/components/checkbox/Checkbox';
import ShowHide from 'src/shared/components/show-hide/ShowHide';
import { useAppDispatch, useAppSelector } from 'src/store';
import { columnSelectionData } from 'src/content/app/tools/biomart/state/biomartSelectors';
import { setColumnSelectionData } from 'src/content/app/tools/biomart/state/biomartSlice';

import styles from '../BiomartForm.module.css';

const BiomartColumnsForm = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(columnSelectionData);

  const toggleSection = (index: number) => {
    if (!data) {
      return;
    }
    const newData = data.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          expanded: !item.expanded
        };
      }
      return item;
    });

    dispatch(setColumnSelectionData(newData));
  };

  const onCheckboxChange = (sectionIndex: number, optionIndex: number) => {
    if (!data) {
      return;
    }
    const newData = data.map((item, i) => {
      if (i === sectionIndex) {
        return {
          ...item,
          options: item.options.map((option, j) => {
            if (j === optionIndex) {
              return {
                ...option,
                checked: !option.checked
              };
            }
            return option;
          })
        };
      }
      return item;
    });

    dispatch(setColumnSelectionData(newData));
  };

  return (
    <div>
      {data &&
        data.map((item, i) => {
          return (
            <div key={`${item}${i}`} className={styles.sectionContainer}>
              <div className={styles.sectionTitleContainer}>
                <ShowHide
                  label={item.label}
                  isExpanded={item.expanded}
                  onClick={() => toggleSection(i)}
                />
              </div>
              {item.expanded && (
                <div className={styles.sectionSelectionContainer}>
                  {item.options.map((option, j) => {
                    return (
                      <Checkbox
                        key={j}
                        label={option.label}
                        checked={option.checked || false}
                        onChange={() => onCheckboxChange(i, j)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default BiomartColumnsForm;
