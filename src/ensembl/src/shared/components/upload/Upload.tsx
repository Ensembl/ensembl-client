import React, { useState } from 'react';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import classNames from 'classnames';

import windowService from 'src/services/window-service';

import styles from './Upload.scss';

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
  onChange: (contents: string[]) => void;
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

  const fileReaders: FileReader[] = [];
  let totalPendingFilesToRead = 0;

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

  const handleFileRead = () => {
    totalPendingFilesToRead--;
    // Do not return the content until all files are read
    if (totalPendingFilesToRead > 0 || props.callbackWithFiles) {
      return;
    }

    const contents: string[] = fileReaders.map(
      (fileReader) => fileReader.result as string
    );

    props.onChange(contents);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDrag(false);

    if (
      e.dataTransfer &&
      e.dataTransfer.files &&
      e.dataTransfer.files.length > 0
    ) {
      if (props.callbackWithFiles) {
        if (!props.allowMultiple) {
          props.onChange(e.dataTransfer.files[0]);
          return;
        }
        props.onChange(e.dataTransfer.files);
        return;
      }

      const { files } = e.dataTransfer;

      forEach(files, (file) => {
        const fileReader = windowService.getFileReader();
        fileReaders.push(fileReader);
        totalPendingFilesToRead++;
        fileReader.onloadend = handleFileRead;
        fileReader[props.fileReaderMethod](file);
      });

      e.dataTransfer.clearData();
    }
  };

  const handleFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files: FileList | null = get(e, 'target.files', null);

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

    forEach(files, (file) => {
      const fileReader = windowService.getFileReader();
      fileReaders.push(fileReader);
      totalPendingFilesToRead++;
      fileReader.onloadend = handleFileRead;
      fileReader[props.fileReaderMethod](file);
    });
  };

  const getDefaultClassNames = () => {
    if (!props.classNames || !props.classNames.default) {
      return styles.defaultUpload;
    }

    return classNames(styles.defaultUpload, props.classNames.default);
  };

  const getActiveClassNames = () => {
    if (!drag) {
      return;
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
      onDrop={handleDrop}
      htmlFor={props.id}
    >
      <input
        type="file"
        id={props.id}
        name={props.name}
        className={styles.fileInput}
        onChange={(e) => handleFileChosen(e)}
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
  id: 'file',
  label: 'Click or Drag file here to upload'
};

export default Upload;
