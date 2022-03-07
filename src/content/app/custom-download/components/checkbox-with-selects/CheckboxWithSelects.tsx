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

import React, { useState, useEffect } from 'react';

import Checkbox from 'src/shared/components/checkbox/Checkbox';
import Select, { Option } from 'src/shared/components/select/Select';
import ImageButton from 'src/shared/components/image-button/ImageButton';

import AddIcon from 'static/icons/icon_plus_circle.svg';
import RemoveIcon from 'static/icons/icon_close.svg';

import styles from './CheckboxWithSelects.scss';

export type CheckboxWithSelectsProps = {
  options: Option[];
  label: string;
  selectedOptions: string[];
  disabled?: boolean;
  onChange: (selectedOptions: string[]) => void;
};

const CheckboxWithSelects = (props: CheckboxWithSelectsProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [shouldShowExtraOption, setShowExtraOption] = useState(false);

  useEffect(() => {
    setIsChecked(props.selectedOptions.length > 0);
  }, [props.selectedOptions]);

  const handleCheckboxOnChange = (isChecked: boolean) => {
    setIsChecked(isChecked);
    if (!isChecked && props.selectedOptions.length > 0) {
      props.onChange([]);
    }
  };

  const handleOnSelect = (value: string, selectIndex?: number) => {
    const newSelectedOptions: string[] = [...props.selectedOptions];
    if (selectIndex !== undefined) {
      newSelectedOptions[selectIndex] = value;
    } else {
      newSelectedOptions.push(value);
    }

    setShowExtraOption(false);
    props.onChange(newSelectedOptions);
  };

  const selectedOptionsClone: string[] = [...props.selectedOptions];

  const newoptions: Option[] = [...props.options].filter((option: Option) => {
    return !selectedOptionsClone.includes(option.value);
  });

  const firstSelectedOption = selectedOptionsClone.shift();
  const firstoptions = [...props.options]
    .filter((option: Option) => {
      return (
        !selectedOptionsClone.includes(option.value) ||
        option.value === firstSelectedOption
      );
    })
    .map((option: Option) => {
      const optionClone = { ...option };
      if (optionClone.value === firstSelectedOption) {
        optionClone.isSelected = true;
      }
      return optionClone;
    });

  const removeSelection = (option: string) => {
    const selectedOptions: string[] = [...props.selectedOptions].filter(
      (value: string) => {
        return value !== option;
      }
    );

    setShowExtraOption(false);
    props.onChange(selectedOptions);
  };

  return (
    <table className={styles.multiselectTable}>
      <tbody>
        <tr>
          <td>
            <Checkbox
              checked={isChecked}
              onChange={handleCheckboxOnChange}
              label={props.label}
              disabled={props.disabled}
            />
          </td>
          <td>
            {!props.disabled && (
              <div>
                <Select
                  options={firstoptions}
                  onSelect={(option: string) => {
                    handleOnSelect(option, 0);
                  }}
                  placeholder={'Select'}
                />
              </div>
            )}
          </td>
          <td>
            {!!firstSelectedOption && (
              <div className={styles.removeIconHolder}>
                <ImageButton
                  onClick={() => removeSelection(firstSelectedOption)}
                  description={'Remove'}
                  image={RemoveIcon}
                />
              </div>
            )}
          </td>
        </tr>

        {selectedOptionsClone.map((selectedOption: string, key: number) => {
          const options = [...props.options]
            .filter((option: Option) => {
              if (
                (selectedOptionsClone.indexOf(option.value) === -1 &&
                  firstSelectedOption !== option.value) ||
                selectedOption === option.value
              ) {
                return true;
              }
              return false;
            })
            .map((option: Option) => {
              const optionClone = { ...option };
              if (optionClone.value === selectedOption) {
                optionClone.isSelected = true;
              }
              return optionClone;
            });

          return (
            <tr key={key}>
              <td />
              <td>
                <div>
                  <Select
                    options={options}
                    onSelect={(option: string) => {
                      handleOnSelect(option, key + 1);
                    }}
                    placeholder={'select'}
                  />
                </div>
              </td>
              <td className={styles.removeIcon}>
                <div className={styles.removeIconHolder}>
                  <ImageButton
                    onClick={() => removeSelection(selectedOption)}
                    description={'Remove'}
                    image={RemoveIcon}
                  />
                </div>
              </td>
            </tr>
          );
        })}

        {shouldShowExtraOption && (
          <tr>
            <td />
            <td>
              <div>
                <Select
                  options={newoptions}
                  onSelect={(option: string) => {
                    handleOnSelect(option);
                  }}
                  placeholder={'Select'}
                />
              </div>
            </td>
            <td />
          </tr>
        )}

        {/* Show the Add button */}
        {props.selectedOptions.length > 0 &&
          !shouldShowExtraOption &&
          newoptions.length > 0 && (
            <tr>
              <td colSpan={2} />
              <td>
                <div className={styles.addIconHolder}>
                  <ImageButton
                    onClick={() => setShowExtraOption(true)}
                    description={'Add'}
                    image={AddIcon}
                  />
                </div>
              </td>
            </tr>
          )}
      </tbody>
    </table>
  );
};

export default CheckboxWithSelects;
