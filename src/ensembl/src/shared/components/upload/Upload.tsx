import React, { useState } from 'react';
import get from 'lodash/get';
import forEach from 'lodash/forEach';
import classNames from 'classnames';

import Overlay from 'src/shared/components/overlay/Overlay';

import styles from './Upload.scss';
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
  onChange: (content: string) => void;
  callbackWithFiles: false;
  allowMultiple: true;
};

type OnChangeProps =
  | PropsForRespondingWithASingleFile
  | PropsForRespondingWithMultipleFiles
  | PropsForRespondingWithContent;

export type UploadProps = {
  id: string;
  name?: string;
  label: string;
  className?: string;
} & OnChangeProps;

const Upload = (props: UploadProps) => {
  const [drag, setDrag] = useState(false);

  const fileReaders: FileReader[] = [];
  let totalPendingFilesToRead = 0;
  let dragCounter = 0;

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;
    if (get(e, 'dataTransfer.items.length', 0) > 0) {
      setDrag(true);
    }
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;
    if (dragCounter === 0) {
      setDrag(false);
    }
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
        const fileReader = new FileReader();
        fileReaders.push(fileReader);
        totalPendingFilesToRead++;
        fileReader.onloadend = handleFileRead;
        fileReader.readAsText(file);
      });

      e.dataTransfer.clearData();
      dragCounter = 0;
    }
  };

  const handleFileRead = () => {
    totalPendingFilesToRead--;
    // Do not return the content until all files are read
    if (totalPendingFilesToRead > 0 || props.callbackWithFiles) {
      return;
    }

    const content: string[] = fileReaders.map(
      (fileReader) => fileReader.result as string
    );

    props.onChange(content.join('\n'));
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
      const fileReader = new FileReader();
      fileReaders.push(fileReader);
      totalPendingFilesToRead++;
      fileReader.onloadend = handleFileRead;
      fileReader.readAsText(file);
    });
  };

  const className = classNames(styles.defaultUpload, props.className);

  return (
    <span
      className={className}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDrop={handleDrop}
    >
      {drag && <Overlay />}
      <input
        type="file"
        id={props.id}
        name={props.name}
        className={styles.fileInput}
        onChange={(e) => handleFileChosen(e)}
        multiple={props.allowMultiple}
      />
      <label htmlFor={props.id}>{props.label}</label>
    </span>
  );
};

Upload.defaultProps = {
  callbackWithFiles: false,
  allowMultiple: true,
  id: 'file',
  label: 'Click or Drag file here to upload'
};

export default Upload;
