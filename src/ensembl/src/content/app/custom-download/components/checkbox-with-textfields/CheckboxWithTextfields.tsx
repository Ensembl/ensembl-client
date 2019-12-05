import React, { useState, useEffect } from 'react';
import Checkbox from 'src/shared/components/checkbox/Checkbox';

import ImageButton from 'src/shared/components/image-button/ImageButton';
import { ReactComponent as RemoveIcon } from 'static/img/shared/clear.svg';

import Textarea from 'src/shared/components/textarea/Textarea';
import Upload, { ReadFile } from 'src/shared/components/upload/Upload';
import { nextUuid } from 'src/shared/helpers/uuid';

import styles from './CheckboxWithTextfields.scss';

export type CheckboxWithTextfieldsProps = {
  textValue: string;
  files: ReadFile[];
  label: string;
  disabled?: boolean;
  onFilesChange: (files: ReadFile[]) => void;
  onReset: () => void;
  onTextChange: (value: string) => void;
};

const CheckboxWithTextfields = (props: CheckboxWithTextfieldsProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const [isTextareaShown, showTextarea] = useState(false);

  const [files, setFiles] = useState<ReadFile[]>([]);

  useEffect(() => {
    setFiles(props.files);

    let checkedStatus = false;

    if (props.textValue && props.textValue.length) {
      showTextarea(true);
      checkedStatus = true;
    }

    if (props.files && props.files.length) {
      checkedStatus = true;
    }

    setIsChecked(checkedStatus);
  }, [props.textValue, props.files]);

  const checkboxOnChange = (newCheckedStatus: boolean) => {
    setIsChecked(newCheckedStatus);
    if (!newCheckedStatus) {
      props.onReset();
    }
  };

  const handleOnRemove = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    props.onFilesChange(newFiles);
  };

  const handleOnUpload = (uploadedFiles: ReadFile[]) => {
    const newFiles = [...files, ...uploadedFiles];
    props.onFilesChange(newFiles);
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
        <div className={styles.textWrapper}>
          <div className={styles.fields}>
            <div className={styles.inputWrapper}>
              {!isTextareaShown && (
                <span
                  className={styles.pasteDataText}
                  onClick={() => showTextarea(true)}
                >
                  Paste Data
                </span>
              )}

              {isTextareaShown && (
                <Textarea
                  onChange={props.onTextChange}
                  placeholder={'Paste data'}
                  value={props.textValue || ''}
                  resizable={false}
                />
              )}
            </div>
          </div>
          <div className={styles.removeIconHolder}>
            {isTextareaShown && (
              <ImageButton
                onClick={() => {
                  props.onTextChange('');
                  showTextarea(false);
                }}
                description={'Remove'}
                image={RemoveIcon}
              />
            )}
          </div>
        </div>
        {props.files &&
          props.files.map((entry, key: number) => {
            return (
              <div key={key} className={styles.filesList}>
                {entry && (entry as ReadFile).filename && (
                  <div key={key} className={styles.fileWrapper}>
                    <span className={styles.fileDetails}>
                      <span
                        className={styles.filename}
                      >{`${entry.filename}`}</span>
                      {entry.error && (
                        <span
                          className={styles.errorMessage}
                        >{`${entry.error}`}</span>
                      )}
                    </span>
                    <div className={styles.removeFileIcon}>
                      <ImageButton
                        onClick={() => handleOnRemove(key)}
                        description={'Remove'}
                        image={RemoveIcon}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        <div className={styles.uploadWrapper}>
          <Upload onChange={handleOnUpload} id={'upload_' + nextUuid()} />
        </div>
      </div>
    </div>
  );
};

export default CheckboxWithTextfields;
