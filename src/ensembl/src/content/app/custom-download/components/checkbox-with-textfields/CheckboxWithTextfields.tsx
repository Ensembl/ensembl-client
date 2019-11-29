import React, { useState, useEffect } from 'react';
import Checkbox from 'src/shared/components/checkbox/Checkbox';
import styles from './CheckboxWithTextfields.scss';

import ImageButton from 'src/shared/components/image-button/ImageButton';
import { ReactComponent as AddIcon } from 'static/img/browser/zoom-in.svg';
import { ReactComponent as RemoveIcon } from 'static/img/shared/clear.svg';

import Textarea from 'src/shared/components/textarea/Textarea';
import Upload, { ReadFile } from 'src/shared/components/upload/Upload';
import { nextUuid } from 'src/shared/helpers/uuid';

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
    props.onChange(newValues.filter(Boolean) as (ReadFile | string)[]);
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
        <div key={0} className={styles.pasteOrUploadWrapper}>
          <div className={styles.textWrapper}>
            <div className={styles.fields}>
              <div className={styles.inputWrapper}>
                <Textarea
                  onChange={(newValue: string) =>
                    handleValueChange(newValue, 0)
                  }
                  placeholder={'Paste data'}
                  value={(filesAndValues[0] as string) || ''}
                  resizable={false}
                />
              </div>
            </div>
            <div className={styles.removeIconHolder}>
              <ImageButton
                onClick={() => handleOnRemove(0)}
                description={'Remove'}
                image={RemoveIcon}
              />
            </div>
          </div>
        </div>
        {(filesAndValues.slice(1) as ReadFile[]).map((entry, key: number) => {
          return (
            <div key={key} className={styles.pasteOrUploadWrapper}>
              {entry && (entry as ReadFile).filename && (
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

              {!entry && (
                <Upload onChange={handleOnUpload} id={'upload_' + nextUuid()} />
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
