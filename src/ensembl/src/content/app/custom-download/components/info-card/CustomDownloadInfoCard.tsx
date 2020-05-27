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
import classNamesMerger from 'classnames';

import closeIcon from 'static/img/shared/close.svg';

import styles from './CustomDownloadInfoCard.scss';

type Props = {
  title: string;
  children: JSX.Element;
  classNames?: {
    infoCardClassName?: string;
    headerClassName?: string;
    bodyClassName?: string;
  };
  onClose?: () => void;
};

const CustomDownloadInfoCard = (props: Props) => {
  const { title, onClose, classNames } = props;

  const inforCardClassNames = classNames
    ? classNamesMerger(styles.infoCardDefault, classNames.infoCardClassName)
    : styles.infoCardDefault;
  const headerClassNames = classNames
    ? classNamesMerger(styles.headerDefault, classNames.headerClassName)
    : styles.headerDefault;
  const bodyClassNames = classNames
    ? classNamesMerger(styles.bodyDefault, classNames.bodyClassName)
    : styles.bodyDefault;

  return (
    <div className={inforCardClassNames}>
      <div className={headerClassNames}>{title}</div>
      <div className={bodyClassNames}>
        <div>{props.children}</div>
        {onClose && (
          <span className={styles.closeButton} onClick={onClose}>
            <img src={closeIcon}></img>
          </span>
        )}
      </div>
    </div>
  );
};

export default CustomDownloadInfoCard;
