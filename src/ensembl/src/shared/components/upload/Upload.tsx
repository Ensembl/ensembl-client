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

import React, { useState, useRef } from 'react';
import get from 'lodash/get';
import classNames from 'classnames';

import windowService from 'src/services/window-service';

import styles from './Upload.scss';

export type ReadFile = {
  filename: string;
  content: string | null | ArrayBuffer;
  error: string | null;
};

const fileReaderErrorMessages: { [key: number]: string } = {
  1: 'The file can not be found (NOT_FOUND_ERR).',
  2: 'The operation is insecure (SECURITY_ERR).',
  4: 'The I/O read operation failed (NOT_READABLE_ERR).'
};

const getFileReaderErrorMessage = (error_code: number) => {
  return fileReaderErrorMessages[error_code] || 'Unable to read the file.';
};

export enum FileReaderMethod {
  ARRAY_BUFFER = 'readAsArrayBuffer',
  BINARY_STRING = 'readAsBinaryString',
  DATA_URL = 'readAsDataURL',
  TEXT = 'readAsText'
}
type PropsForRespondingWithASingleFile = {
  onChange: (file: File) => void;
  callbackWithFiles: true;
  allowMultiple: false;
};

type PropsForRespondingWithMultipleFiles = {
  onChange: (files: FileList) => void;
  callbackWithFiles: true;
  allowMultiple: true;
};

type PropsForRespondingWithContent = {
  onChange: (files: ReadFile[]) => void;
  callbackWithFiles: false;
  fileReaderMethod: FileReaderMethod;
};

type OnChangeProps =
  | PropsForRespondingWithASingleFile
  | PropsForRespondingWithMultipleFiles
  | PropsForRespondingWithContent;

export type UploadProps = {
  name?: string;
  label: string;
  classNames?: {
    default?: string;
    active?: string;
    disabled?: string;
  };
  allowMultiple?: boolean;
  disabled?: boolean;
} & OnChangeProps;

const Upload = (props: UploadProps) => {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (get(e, 'dataTransfer.items.length', 0) > 0) {
      setDrag(true);
    }
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDrag(false);
  };

  const handleSelectedFiles = async (
    e: React.ChangeEvent<HTMLInputElement> | React.DragEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const eventType = e.type;
    if (eventType === 'drop') {
      (e as React.DragEvent).dataTransfer.clearData();
    }
    setDrag(false);

    const files: FileList | null =
      get(e, 'target.files') || get(e, 'dataTransfer.files') || null;

    if (files?.length) {
      await processFiles(files);
    }

    clearInput();
  };

  const processFiles = async (files: FileList) => {
    if (props.callbackWithFiles) {
      // Just pass the first file to the callback if allowMultiple is true
      if (!props.allowMultiple) {
        props.onChange(files[0]);
        return;
      }
      props.onChange(files);
      return;
    }

    const filesToRead = props.allowMultiple
      ? [...files]
      : [...files].slice(0, 1);

    const promises = filesToRead.map((file) => {
      const fileReader: FileReader = windowService.getFileReader();
      return new Promise((resolve) => {
        fileReader.onload = resolve;
        fileReader.onerror = resolve;
        fileReader[props.fileReaderMethod](file);
      }).then(() => ({
        filename: file.name,
        content: fileReader.result,
        error: fileReader.error
          ? getFileReaderErrorMessage(fileReader.error.code)
          : null
      }));
    });

    const results = await Promise.all(promises);
    props.onChange(results);
  };

  const clearInput = () => {
    const inputElement = inputRef.current;
    if (inputElement) {
      inputElement.value = '';
    }
  };

  const getDefaultClassNames = () => {
    if (!props.classNames || !props.classNames.default) {
      return styles.defaultUpload;
    }

    return classNames(styles.defaultUpload, props.classNames.default);
  };

  const getActiveClassNames = () => {
    if (!drag) {
      return '';
    }

    if (!props.classNames || !props.classNames.active) {
      return styles.defaultUploadActive;
    }

    return classNames(styles.defaultUploadActive, props.classNames.active);
  };

  if (props.disabled) {
    const elementClasses = classNames(
      styles.disabledUpload,
      props.classNames?.disabled
    );
    // using the label html tag even though there is no input
    // to keep it the same as the label element of the enabled component (to support animations)
    return <label className={elementClasses}>{props.label}</label>;
  }

  return (
    <label
      className={`${getDefaultClassNames()} ${getActiveClassNames()}`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleSelectedFiles}
    >
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

Upload.defaultProps = {
  callbackWithFiles: false,
  allowMultiple: true,
  fileReaderMethod: FileReaderMethod.TEXT,
  label: 'Click or drag file(s) here to upload'
};

export default Upload;
