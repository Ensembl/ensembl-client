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

import React, { ReactNode } from 'react';
import classNamesMerger from 'classnames';

import CloseButton from 'src/shared/components/close-button/CloseButton';

import styles from './SidebarModal.scss';

export type SidebarModalProps = {
  title: ReactNode;
  children: ReactNode;
  classNames?: {
    wrapper?: string;
    title?: string;
    content?: string;
    closeButton?: string;
  };
  onClose?: () => void;
};

const SidebarModal = (props: SidebarModalProps) => {
  const { title, onClose, classNames } = props;

  const wrapperClassNames = classNames
    ? classNamesMerger(styles.wrapper, classNames.wrapper)
    : styles.wrapper;

  const titleClassNames = classNames
    ? classNamesMerger(styles.title, classNames.title)
    : styles.title;

  const contentClassNames = classNames
    ? classNamesMerger(styles.content, classNames.content)
    : styles.content;

  const closeButtonClassNames = classNames
    ? classNamesMerger(styles.closeButton, classNames.closeButton)
    : styles.closeButton;

  return (
    <div className={wrapperClassNames}>
      {onClose && (
        <CloseButton className={closeButtonClassNames} onClick={onClose} />
      )}
      <h3 className={titleClassNames}>{title}</h3>
      <div className={contentClassNames}>
        <div>{props.children}</div>
      </div>
    </div>
  );
};

export default SidebarModal;
