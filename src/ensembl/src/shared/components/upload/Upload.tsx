import React, { useState } from 'react';
import get from 'lodash/get';
import classNames from 'classnames';

import windowService from 'src/services/window-service';
import { generateId } from 'src/shared/helpers/generateId';

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
  id: string;
  name?: string;
  label: string;
  classNames?: {
    default?: string;
    active?: string;
  };
  allowMultiple?: boolean;
} & OnChangeProps;

const Upload = (props: UploadProps) => {
  const [drag, setDrag] = useState(false);

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

    if (!files) {
      return;
    }

    if (props.callbackWithFiles) {
      // Just consider the first file if allowMultiple is true
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
        id={props.id}
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
  id: 'upload_' + generateId(),
  callbackWithFiles: false,
  allowMultiple: true,
  fileReaderMethod: FileReaderMethod.TEXT,
  label: 'Click or drag file(s) here to upload'
};

export default Upload;
