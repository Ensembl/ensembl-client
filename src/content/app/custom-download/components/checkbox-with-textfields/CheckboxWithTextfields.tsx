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

import React, { useState, useEffect, FormEvent, useCallback } from 'react';

import Checkbox from 'src/shared/components/checkbox/Checkbox';
import Textarea from 'src/shared/components/textarea/Textarea';
import { Upload, FileTransformedToString } from 'src/shared/components/upload';
import ImageButton from 'src/shared/components/image-button/ImageButton';

import { ReactComponent as RemoveIcon } from 'static/icons/clear.svg';

import styles from './CheckboxWithTextfields.scss';

export type CheckboxWithTextfieldsProps = {
  textValue: string;
  files: FileTransformedToString[];
  label: string;
  disabled?: boolean;
  onFilesChange: (files: FileTransformedToString[]) => void;
  onReset: () => void;
  onTextChange: (value: string) => void;
};

const CheckboxWithTextfields = (props: CheckboxWithTextfieldsProps) => {
  const [isChecked, setIsChecked] = useState(false);

  const [isTextareaShown, showTextarea] = useState(false);

  const [files, setFiles] = useState<FileTransformedToString[]>([]);

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

    if (checkedStatus) {
      setIsChecked(checkedStatus);
    }
  }, [props.textValue, props.files]);

  const checkboxOnChange = (newCheckedStatus: boolean) => {
    setIsChecked(newCheckedStatus);
    if (!newCheckedStatus) {
      props.onReset();
    }
  };

  const onTextChange = useCallback(
    (event: FormEvent<HTMLTextAreaElement>) => {
      props.onTextChange(event.currentTarget.value);
    },
    [props.onTextChange]
  );

  const handleRemove = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    props.onFilesChange(newFiles);
  };

  const handleUpload = (uploadedFiles: FileTransformedToString[]) => {
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
                  onChange={onTextChange}
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
                {entry && (entry as FileTransformedToString).filename && (
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
                        onClick={() => handleRemove(key)}
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
          <Upload
            onUpload={handleUpload}
            transformTo="text"
            allowMultiple={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CheckboxWithTextfields;
