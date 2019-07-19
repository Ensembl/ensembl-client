import React, { useState, useEffect } from 'react';
import Checkbox from 'src/shared/checkbox/Checkbox';
import styles from './CheckboxWithTextfields.scss';

import ImageButton from 'src/shared/image-button/ImageButton';
import { ReactComponent as AddIcon } from 'static/img/browser/zoom-in.svg';
import PasteOrUpload from '../paste-or-upload/PasteOrUpload';
import cloneDeep from 'lodash/cloneDeep';

export type CheckboxWithTextfieldsProps = {
  values: string[];
  label: string;
  allowMultiple: boolean;
  disabled?: boolean;
  onChange: (values: string[]) => void;
};

const CheckboxWithTextfields = (props: CheckboxWithTextfieldsProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [shouldShowAddButton, setShowAddButton] = useState(
    Boolean(props.values[props.values.length - 1])
  );

  useEffect(() => {
    setIsChecked(props.values.length > 0);
    setShowAddButton(Boolean(props.values[props.values.length - 1]));
  }, [props.values]);

  const handleCheckboxOnChange = (isChecked: boolean) => {
    setIsChecked(isChecked);
    if (!isChecked && props.values.length > 0) {
      props.onChange([]);
    }
  };

  const addEntry = () => {
    setShowAddButton(false);
    props.onChange([...props.values, '']);
  };

  const handleOnChange = (value: string, index: number) => {
    const newValues: string[] = cloneDeep(props.values);
    newValues[index] = value;

    setShowAddButton(Boolean(newValues[newValues.length - 1]));

    props.onChange(newValues);
  };

  const handleOnRemove = (index: number) => {
    const newValues: string[] = cloneDeep(props.values);

    newValues.splice(index, 1);
    setShowAddButton(Boolean(newValues[newValues.length - 1]));

    props.onChange(newValues);
  };

  const valuesWithoutFirst: string[] = cloneDeep(props.values);
  valuesWithoutFirst.shift();

  return (
    <table className={styles.wrapperTable}>
      <tbody>
        <tr>
          <td className={styles.checkboxWrapper}>
            <Checkbox
              checked={isChecked}
              onChange={handleCheckboxOnChange}
              label={props.label}
              disabled={props.disabled}
            />
          </td>
          <td>
            <div className={styles.fieldsWrapper}>
              {isChecked && (
                <div key={0}>
                  <PasteOrUpload
                    value={props.values[0]}
                    onChange={(value) => handleOnChange(value, 0)}
                    onRemove={() => handleOnRemove(0)}
                    placeholder={'Paste data'}
                  />
                </div>
              )}

              {isChecked &&
                valuesWithoutFirst.map((value: string, key: number) => {
                  return (
                    <div key={key + 1}>
                      <PasteOrUpload
                        value={value}
                        onChange={(newValue) =>
                          handleOnChange(newValue, key + 1)
                        }
                        onRemove={() => handleOnRemove(key + 1)}
                        placeholder={'Paste data'}
                      />
                    </div>
                  );
                })}

              {/* Show the Add button */}
              {shouldShowAddButton && props.allowMultiple && (
                <div className={styles.addIconHolder}>
                  <ImageButton
                    onClick={addEntry}
                    description={'Add'}
                    image={AddIcon}
                  />
                </div>
              )}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

CheckboxWithTextfields.defaultProps = {
  allowMultiple: false
};
export default CheckboxWithTextfields;
