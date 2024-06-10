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

import { useRef, type ChangeEvent, type ReactNode } from 'react';
import classNames from 'classnames';

import useFileDrop from './hooks/useFileDrop';
import { transformFiles, transformFile } from './helpers/uploadHelpers';

import type { FileUploadParams, Options, Result } from './types';

import styles from './FileDropZone.module.css';

/**
 * Compare:
 * - Drag-and-drop upload container component of IBM's Carbon design system
 *   https://web-components.carbondesignsystem.com/?path=/story/components-file-uploader--drag-and-drop-upload-container-example-application
 *
 */

export type FiledropZoneProps<T extends Options> = FileUploadParams<T> & {
  name?: string; // Could be useful if the filedrop zone were inside a form submitted without help of javascript (unlikely)
  disabled?: boolean;
  className?: string;
  children?: ReactNode;
};

const FiledropZone = <T extends Options>(props: FiledropZoneProps<T>) => {
  const { allowMultiple, transformTo } = props;
  const { ref, isDraggedOver } = useFileDrop(props);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSelectedFiles = async (event: ChangeEvent<HTMLInputElement>) => {
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
    styles.fileDropZone,
    { [styles.disabled]: props.disabled },
    { [styles.draggedOver]: isDraggedOver },
    props.className
  );

  return (
    <label ref={ref} className={dropAreaClasses}>
      <input
        type="file"
        ref={inputRef}
        name={props.name}
        className={styles.fileInput}
        onChange={(e) => handleSelectedFiles(e)}
        multiple={props.allowMultiple}
        disabled={props.disabled}
      />
      {props.children}
    </label>
  );
};

export default FiledropZone;
