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
import classNames from 'classnames';

import { PrimaryButton } from 'src/shared/components/button/Button';

import styles from './DeletionConfirmation.scss';

export type DeletionConfirmationProps = {
  message?: string;
  confirmButtonLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  className?: string;
};

const DeletionConfirmation = (props: DeletionConfirmationProps) => {
  const containerClass = classNames(
    styles.deleteMessageContainer,
    props.className
  );

  return (
    <div className={containerClass}>
      <span className={styles.deleteMessage}>{props.message}</span>
      <PrimaryButton onClick={props.onConfirm}>
        {props.confirmButtonLabel}
      </PrimaryButton>
      <span className={styles.clickable} onClick={props.onCancel}>
        {props.cancelLabel}
      </span>
    </div>
  );
};

DeletionConfirmation.defaultProps = {
  message: 'Are you sure you want to delete?',
  confirmButtonLabel: 'Delete',
  cancelLabel: 'Do not delete'
};

export default DeletionConfirmation;
