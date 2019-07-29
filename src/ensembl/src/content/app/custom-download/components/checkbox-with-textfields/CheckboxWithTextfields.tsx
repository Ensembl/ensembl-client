import React, { useState, useEffect } from 'react';
import Checkbox from 'src/shared/checkbox/Checkbox';
import styles from './CheckboxWithTextfields.scss';

import ImageButton from 'src/shared/image-button/ImageButton';
import { ReactComponent as AddIcon } from 'static/img/browser/zoom-in.svg';
import PasteOrUpload from '../paste-or-upload/PasteOrUpload';

export type CheckboxWithTextfieldsProps = {
  values: string[];
  label: string;
  allowMultiple: boolean;
  disabled?: boolean;
  onChange: (values: string[]) => void;
};

const CheckboxWithTextfields = (props: CheckboxWithTextfieldsProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [values, setValues] = useState<(string | null)[]>(props.values);

  const [shouldShowAddButton, setShowAddButton] = useState(
    Boolean(values[values.length - 1])
  );

  useEffect(() => {
    if (!props.values.length) {
      setValues([null]);
    } else {
      setValues(props.values);
    }

    setIsChecked(props.values.length > 0);
    setShowAddButton(Boolean(props.values[props.values.length - 1]));
  }, [props.values]);

  const handleCheckboxOnChange = (isChecked: boolean) => {
    setIsChecked(isChecked);
    if (!isChecked && values.length > 0) {
      props.onChange([]);
    }
  };

  const addEntry = () => {
    setShowAddButton(false);
    setValues([...values, null]);
  };

  const handleOnChange = (value: string, index: number) => {
    const newValues: string[] = [...values] as string[];
    newValues[index] = value;

    setShowAddButton(Boolean(newValues[newValues.length - 1]));

    props.onChange(newValues);
  };

  const handleOnRemove = (index: number) => {
    const newValues: string[] = [...values] as string[];

    newValues.splice(index, 1);
    setShowAddButton(Boolean(newValues[newValues.length - 1]));

    props.onChange(newValues);
  };

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
              {isChecked &&
                values.map((value: string | null, key: number) => {
                  return (
                    <div key={key}>
                      <PasteOrUpload
                        value={value}
                        onChange={(newValue) => handleOnChange(newValue, key)}
                        onRemove={() => handleOnRemove(key)}
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
