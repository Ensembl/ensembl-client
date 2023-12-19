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
import classNames from 'classnames';

import CloseButton from 'src/shared/components/close-button/CloseButton';

import styles from './Modal.module.css';

type Props = {
  onClose: () => void;
  children: ReactNode;
  classNames?: {
    background?: string;
    body?: string;
  };
};

const Modal = (props: Props) => {
  const preventEventBubbling = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  const backgroundClasses = classNames(
    styles.background,
    props.classNames?.background
  );

  const bodyClasses = classNames(styles.body, props.classNames?.body);

  const modal = (
    <div className={backgroundClasses} onClick={props.onClose}>
      <div className={bodyClasses} onClick={preventEventBubbling}>
        <div className={styles.close}>
          <CloseButton onClick={props.onClose} />
        </div>
        {props.children}
      </div>
    </div>
  );

  return modal;
};

export default Modal;
