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

import CloseButton from 'src/shared/components/close-button/CloseButton';

import styles from './Modal.scss';

type Props = {
  onClose: () => void;
  children: ReactNode;
};

const Modal = (props: Props) => {
  const preventEventBubbling = (event: React.SyntheticEvent) => {
    event.stopPropagation();
  };

  const modal = (
    <div className={styles.background} onClick={props.onClose}>
      <div className={styles.body} onClick={preventEventBubbling}>
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
