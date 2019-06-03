import React, { useState, useEffect, useCallback } from 'react';
import Checkbox from 'src/shared/checkbox/Checkbox';
import Select, { Option } from 'src/shared/select/Select';
import styles from './CheckboxWithSelects.scss';

import ImageButton from 'src/shared/image-button/ImageButton';
import { ReactComponent as AddIcon } from 'static/img/browser/zoom-in.svg';
import { ReactComponent as RemoveIcon } from 'static/img/shared/clear.svg';

type Props = {
  selectOptions: Option[];
  label: string;
  selectedOptions: [];
  onChange: (selectedOptions: []) => void;
};

const CheckboxWithSelects = (props: Props) => {
  const [checkedStatus, setCheckedStatus] = useState(false);
  const [shouldShowExtraOption, setShowExtraOption] = useState(false);

  useEffect(() => {
    if (props.selectedOptions.length > 0) {
      setCheckedStatus(true);
      setShowExtraOption(true);
    }
  }, []);

  const handleCheckboxOnChange = useCallback(
    (checkedStatus: boolean) => {
      setCheckedStatus(checkedStatus);
      props.onChange([]);
    },
    [props.selectedOptions]
  );

  const handleOnSelect = useCallback(
    (value: string, selectIndex?: number) => {
      const newSelectedOptions: any = [...props.selectedOptions];
      if (selectIndex) {
        newSelectedOptions[selectIndex] = value;
      } else {
        newSelectedOptions.push(value);
      }

      setShowExtraOption(false);
      props.onChange(newSelectedOptions);
    },
    [props.selectedOptions]
  );

  const selectedOptionsClone: any = [...props.selectedOptions];

  const newSelectOptions: any = [...props.selectOptions].filter(
    (option: any) => {
      if (selectedOptionsClone.indexOf(option.value) === -1) {
        return true;
      }
      return false;
    }
  );

  const firstSelectedOption = selectedOptionsClone.shift();
  const firstSelectOptions = [...props.selectOptions].map((option: any) => {
    const optionClone = { ...option };
    if (optionClone.value === firstSelectedOption) {
      optionClone.isSelected = true;
    }
    return optionClone;
  });

  const removeSelection = useCallback(
    (option: string | undefined) => {
      const selectedOptions: any = [...props.selectedOptions];
      const removeSelectionIndex = selectedOptions.indexOf(option);
      selectedOptions.splice(removeSelectionIndex, 1);
      setShowExtraOption(false);
      props.onChange(selectedOptions);
    },
    [props.selectedOptions]
  );

  return (
    <>
      <table className={styles.multiselectTable}>
        <tbody>
          <tr>
            <td>
              <Checkbox
                checked={checkedStatus}
                onChange={handleCheckboxOnChange}
                label={props.label}
              />
            </td>
            <td>
              {checkedStatus && (
                <div>
                  <Select
                    options={firstSelectOptions}
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
                <div className={styles.iconHolder}>
                  <ImageButton
                    onClick={() => removeSelection(firstSelectedOption)}
                    description={'Remove'}
                    image={RemoveIcon}
                  />
                </div>
              )}
            </td>
          </tr>

          {selectedOptionsClone.map((selectedOption: any, key: number) => {
            const selectOptions = [...props.selectOptions]
              .filter((option: any) => {
                if (
                  (selectedOptionsClone.indexOf(option.value) == -1 &&
                    firstSelectedOption !== option.value) ||
                  selectedOption === option.value
                ) {
                  return true;
                }
                return false;
              })
              .map((option: any) => {
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
                      options={selectOptions}
                      onSelect={(option: string) => {
                        handleOnSelect(option, key + 1);
                      }}
                      placeholder={'select'}
                    />
                  </div>
                </td>
                <td className={styles.removeIcon}>
                  <div className={styles.iconHolder}>
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

          {/* Show the Add button */}
          {props.selectedOptions.length > 0 &&
            !shouldShowExtraOption &&
            newSelectOptions.length > 0 && (
              <tr>
                <td colSpan={2} />
                <td>
                  <div className={styles.iconHolder}>
                    <ImageButton
                      onClick={() => setShowExtraOption(true)}
                      description={'Add'}
                      image={AddIcon}
                    />
                  </div>
                </td>
              </tr>
            )}

          {shouldShowExtraOption && (
            <tr>
              <td />
              <td>
                <div>
                  <Select
                    options={newSelectOptions}
                    onSelect={(option: string) => {
                      handleOnSelect(option);
                    }}
                    placeholder={'select'}
                  />
                </div>
              </td>
              <td />
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

export default CheckboxWithSelects;
