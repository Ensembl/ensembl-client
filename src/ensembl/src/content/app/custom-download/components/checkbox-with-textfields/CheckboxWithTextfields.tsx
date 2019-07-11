import React, { useState } from 'react';
import Checkbox from 'src/shared/checkbox/Checkbox';
import styles from './CheckboxWithTextfields.scss';

import ImageButton from 'src/shared/image-button/ImageButton';
import { ReactComponent as AddIcon } from 'static/img/browser/zoom-in.svg';
import PasteOrUpload from '../paste-or-upload/PasteOrUpload';

export type CheckboxWithTextfieldsProps = {
  values: string[];
  label: string;
  onChange: (values: string[]) => void;
};

const CheckboxWithTextfields = (props: CheckboxWithTextfieldsProps) => {
  const [isChecked, setisChecked] = useState(props.values.length > 0);
  const [shouldShowAddButton, setShowAddButton] = useState(false);

  const handleCheckboxOnChange = (isChecked: boolean) => {
    setisChecked(isChecked);
    props.onChange([]);
  };

  const addEntry = () => {
    setShowAddButton(false);
    props.onChange([...props.values, '']);
  };

  const handleOnChange = (value: string, index: number) => {
    const newValues: string[] = [...props.values];
    newValues[index] = value;

    setShowAddButton(Boolean(newValues[newValues.length - 1]));

    props.onChange(newValues);
  };

  const handleOnRemove = (index: number) => {
    const newValues: string[] = [...props.values];

    newValues.splice(index, 1);
    setShowAddButton(Boolean(newValues[newValues.length - 1]));

    props.onChange(newValues);
  };

  const valuesWithoutFirst = [...props.values];
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
              {shouldShowAddButton && (
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

export default CheckboxWithTextfields;
