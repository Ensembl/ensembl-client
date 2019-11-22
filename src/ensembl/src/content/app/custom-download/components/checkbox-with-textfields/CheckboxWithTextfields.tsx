import React, { useState, useEffect } from 'react';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import styles from './CheckboxWithTextfields.scss';

import ImageButton from 'src/shared/components/image-button/ImageButton';
import { ReactComponent as AddIcon } from 'static/img/browser/zoom-in.svg';
import { ReactComponent as RemoveIcon } from 'static/img/shared/clear.svg';
import PasteOrUpload from 'src/shared/components/paste-or-upload/PasteOrUpload';
import { ReadFile } from 'src/shared/components/upload/Upload';

export type CheckboxWithTextfieldsProps = {
  values: (string | ReadFile)[];
  label: string;
  allowMultiple: boolean;
  disabled?: boolean;
  onChange: (values: (string | ReadFile)[]) => void;
};

const CheckboxWithTextfields = (props: CheckboxWithTextfieldsProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [filesAndValues, setFilesAndValues] = useState<
    (ReadFile | string | null)[]
  >([null]);

  const [shouldShowAddButton, setShowAddButton] = useState(false);

  useEffect(() => {
    if (!filesAndValues.filter(Boolean).length && props.values.length) {
      setFilesAndValues(props.values);
    }

    setIsChecked(props.values.length > 0);
    setShowAddButton(Boolean(filesAndValues[filesAndValues.length - 1]));
  }, [props.values]);

  const checkboxOnChange = (isChecked: boolean) => {
    setIsChecked(isChecked);
    if (!isChecked && filesAndValues.length > 0) {
      props.onChange([]);
    }
  };

  const updateFilesAndValues = (newValues: (ReadFile | string | null)[]) => {
    if (newValues.filter(Boolean).length) {
      setFilesAndValues(newValues);
    } else {
      setFilesAndValues([null]);
    }
  };

  const addEntry = () => {
    setShowAddButton(false);
    setFilesAndValues([...filesAndValues, null]);
  };

  const handleOnChange = () => {
    const values: (string | ReadFile)[] = [];
    filesAndValues.forEach((entry) => {
      if (typeof entry === 'string') {
        values.push(entry);
      } else if (
        entry &&
        (entry as ReadFile).content &&
        !(entry as ReadFile).error
      ) {
        values.push(entry);
      }
    });

    setShowAddButton(Boolean(values[values.length - 1]));

    props.onChange(values);
  };

  const updateValue = (value: string, index: number) => {
    const newValues = [...filesAndValues];

    const entry = newValues[index];

    if (typeof entry === 'string' || entry === null) {
      newValues[index] = value;
    } else if (entry !== null && (entry as ReadFile).filename) {
      (newValues[index] as ReadFile).content = value;
    }

    updateFilesAndValues(newValues);
  };

  useEffect(() => {
    handleOnChange();
  }, [filesAndValues]);

  const handleValueChange = (value: string, index: number) => {
    const newValues = [...filesAndValues];
    newValues[index] = value;
    updateValue(value, index);
  };

  const handleOnRemove = (index: number) => {
    const newValues = [...filesAndValues];

    newValues.splice(index, 1);
    updateFilesAndValues(newValues);
  };

  const handleOnUpload = (files: ReadFile[]) => {
    const newValues = [...filesAndValues.filter(Boolean), ...files];

    updateFilesAndValues(newValues);
  };

  return (
    <div className={styles.wrapperTable}>
      <div className={styles.checkboxWrapper}>
        <Checkbox
          checked={isChecked}
          onChange={checkboxOnChange}
          label={props.label}
          disabled={props.disabled}
        />
      </div>

      <div className={styles.fieldsWrapper}>
        {filesAndValues.map((entry: ReadFile | string | null, key: number) => {
          return (
            <div key={key} className={styles.pasteOrUploadWrapper}>
              {typeof entry !== 'string' && entry && entry.filename && (
                <div key={key} className={styles.fileWrapper}>
                  <span className={styles.fileDetails}>
                    <span
                      className={styles.filename}
                    >{`${entry.filename}`}</span>
                    {entry.error && (
                      <span
                        className={styles.errorMessage}
                      >{` ${entry.error}`}</span>
                    )}
                  </span>
                  <div className={styles.removeErrorIcon}>
                    <ImageButton
                      onClick={() => handleOnRemove(key)}
                      description={'Remove'}
                      image={RemoveIcon}
                    />
                  </div>
                </div>
              )}
              {(typeof entry === 'string' || !entry) && (
                <PasteOrUpload
                  value={entry}
                  onChange={(newValue) => handleValueChange(newValue, key)}
                  onRemove={() => handleOnRemove(key)}
                  onUpload={(files: ReadFile[]) => handleOnUpload(files)}
                  placeholder={'Paste data'}
                />
              )}
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
    </div>
  );
};

CheckboxWithTextfields.defaultProps = {
  allowMultiple: false
};
export default CheckboxWithTextfields;
