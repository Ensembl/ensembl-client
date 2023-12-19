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

import React, { type ReactNode } from 'react';

import CloseButton from 'src/shared/components/close-button/CloseButton';

import styles from './ModalView.module.css';

type Props = {
  children: ReactNode;
  onClose: () => void;
};

const ModalView = (props: Props) => {
  const { children, onClose } = props;

  return (
    <div className={styles.modalView}>
      <CloseButton onClick={onClose} className={styles.closeButton} />
      {children}
    </div>
  );
};

export default ModalView;
