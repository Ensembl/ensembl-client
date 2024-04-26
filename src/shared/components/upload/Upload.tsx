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

import { useRef } from 'react';

import * as React from 'react';
import classNames from 'classnames';

import useFileDrop from './hooks/useFileDrop';
import { transformFiles, transformFile } from './helpers/uploadHelpers';

import UploadIcon from 'static/icons/icon_upload.svg';

import type { FileUploadParams, Options, Result } from './types';

import styles from './Upload.module.css';

export type UploadProps<T extends Options> = FileUploadParams<T> & {
  name?: string; // FIXME: do we really need this?
  label?: string;
  disabled?: boolean;
};

const defaultLabel = 'Click or drag a file here to upload';

const Upload = <T extends Options>(props: UploadProps<T>) => {
  const { allowMultiple, transformTo } = props;
  const { ref, isDraggedOver } = useFileDrop(props);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectedFiles = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = [...(event.target.files as FileList)];

    if (transformTo) {
      const result = allowMultiple
        ? await transformFiles(files, transformTo)
        : await transformFile(files[0], transformTo);
      props.onUpload(result as Result<T>);
    } else if (allowMultiple) {
      props.onUpload([...files] as Result<T>);
    } else {
      props.onUpload(files[0] as Result<T>);
    }

    clearInput();
  };

  const clearInput = () => {
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.value = '';
    }
  };

  const dropAreaClasses = classNames(
    styles.upload,
    { [styles.uploadDisabled]: props.disabled },
    { [styles.uploadDragOver]: isDraggedOver }
  );

  return (
    <label ref={ref} className={dropAreaClasses}>
      <span className={styles.label}>{props.label || defaultLabel}</span>
      <UploadIcon className={styles.uploadIcon} />
      <input
        type="file"
        ref={inputRef}
        name={props.name}
        className={styles.fileInput}
        onChange={(e) => handleSelectedFiles(e)}
        multiple={props.allowMultiple}
      />
      {props.label}
    </label>
  );
};

export default Upload;
