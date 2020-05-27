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

import Checkbox from 'src/shared/components/checkbox/Checkbox';

import styles from './EntityViewerTranscriptFilter.scss';

export type Option = {
  value: string;
  label: string;
};

export type OptionsGroup = Option[];

export type EntityViewerTranscriptFilterProps = {
  selectedValues: string[];
  onChange: (selectedValues: string[]) => void;
  optionGroups: OptionsGroup[];
  isExpanded: boolean;
};

const EntityViewerTranscriptFilter = (
  props: EntityViewerTranscriptFilterProps
) => {
  const handleChange = (isChecked: boolean, optionIndex: [number, number]) => {
    const [groupIndex, itemIndex] = optionIndex;
    const selectedOption = props.optionGroups[groupIndex][itemIndex].value;

    if (isChecked) {
      const newSelectedOptions = [...props.selectedValues, selectedOption];
      props.onChange(newSelectedOptions);
    } else {
      const newSelectedOptions = [...props.selectedValues].filter(
        (option) => option !== selectedOption
      );

      props.onChange(newSelectedOptions);
    }
  };

  return (
    <div className={styles.wrapper}>
      {props.optionGroups.map((options, groupIndex) => {
        const optionGroupClassName = classNames(styles.checkboxPadding, {
          [styles.optionGroup]: props.isExpanded
        });

        return (
          <div key={groupIndex} className={optionGroupClassName}>
            {options.map((option, itemIndex) => {
              const checkedStatus = props.selectedValues.includes(option.value);
              if (!props.isExpanded && !checkedStatus) {
                return null;
              }

              return (
                <div key={itemIndex}>
                  <Checkbox
                    label={option.label}
                    labelClassName={styles.checkboxLabel}
                    checked={checkedStatus}
                    onChange={(status) =>
                      handleChange(status, [groupIndex, itemIndex])
                    }
                    classNames={{
                      unchecked: styles.checkboxUnchecked,
                      checked: styles.checkboxChecked
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

EntityViewerTranscriptFilter.defaultProps = {
  isExpanded: true
};

export default EntityViewerTranscriptFilter;
