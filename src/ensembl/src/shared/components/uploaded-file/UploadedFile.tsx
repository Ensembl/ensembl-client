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

import React from 'react';
import filesize from 'filesize';
import classNames from 'classnames';

import CloseButton from 'src/shared/components/close-button/CloseButton';

import styles from './UploadedFile.scss';

type Props = {
  file: File;
  onDelete: () => void;
  classNames?: {
    wrapper?: string;
    name?: string;
    fileSize?: string;
  };
};

const UploadedFile = (props: Props) => {
  const fileName = props.file.name;
  const fileSize = filesize(props.file.size);

  const elementClasses = classNames(
    styles.uploadedFile,
    props.classNames?.wrapper
  );

  const nameClasses = classNames(styles.name, props.classNames?.name);

  const fileSizeClasses = classNames(styles.size, props.classNames?.fileSize);

  return (
    <div className={elementClasses}>
      <span className={nameClasses}>{fileName}</span>
      <span className={fileSizeClasses}>{fileSize}</span>
      <span className={styles.delete}>
        <CloseButton onClick={props.onDelete} />
      </span>
    </div>
  );
};

export default UploadedFile;
