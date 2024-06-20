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

import classNames from 'classnames';

import FiledropZone, { type FiledropZoneProps } from './FileDropZone';
import UploadIcon from 'static/icons/icon_upload.svg';

import type { FileUploadParams, Options } from './types';

import styles from './Upload.module.css';

export type UploadProps<T extends Options> = FileUploadParams<T> & {
  name?: string; // Could be useful if the filedrop zone were inside a form submitted without help of javascript (unlikely)
  disabled?: boolean;
  label?: string;
  className?: string;
};

const defaultLabel = 'Click or drag a file here to upload';

/**
 * NOTE:
 * This component puts an upload icon with the default or slightly customizable label text
 * inside of the FileDropZone.
 * If you need more flexibility for your upload button, use FileDropZone directly to create it.
 */

const Upload = <T extends Options>(props: UploadProps<T>) => {
  const componentClasses = classNames(
    styles.upload,
    { [styles.disabled]: props.disabled },
    props.className
  );

  return (
    <FiledropZone
      {...(props as FiledropZoneProps<T>)}
      className={componentClasses}
    >
      <div className={styles.label}>
        <span className={styles.labelText}>{props.label || defaultLabel}</span>
        <UploadIcon className={styles.uploadIcon} />
      </div>
    </FiledropZone>
  );
};

export default Upload;
