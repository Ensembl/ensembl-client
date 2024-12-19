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

import { useRef, type ReactNode, type SyntheticEvent } from 'react';
import classNames from 'classnames';

import CloseButton from 'src/shared/components/close-button/CloseButton';

import styles from './Modal.module.css';

type Props = {
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

const Modal = (props: Props) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const dialogCallbackRef = (element: HTMLDialogElement) => {
    element.showModal();
    element.addEventListener('cancel', handleClose);
    element.addEventListener('close', handleClose);

    dialogRef.current = element;
    return () => {
      element.removeEventListener('cancel', handleClose);
      element.removeEventListener('close', handleClose);
    };
  };

  const handleClick = (event: SyntheticEvent<HTMLElement>) => {
    const element = event.target;
    if (element === dialogRef.current) {
      // user clicked on the dialog backdrop
      handleClose();
    }
  };

  const handleClose = () => {
    // setTimeout gives the closing dialog the opportunity to set focus
    // back to the element that opened it
    setTimeout(() => {
      props.onClose();
    }, 0);
  };

  const onCloseButtonPress = () => {
    dialogRef.current?.close();
  };

  const componentClasses = classNames(styles.dialog, props.className);

  return (
    <dialog
      ref={dialogCallbackRef}
      className={componentClasses}
      onClick={handleClick}
    >
      <div className={styles.contentWrapper}>
        <div className={styles.close}>
          <CloseButton onClick={onCloseButtonPress} />
        </div>
        {props.children}
      </div>
    </dialog>
  );
};

export default Modal;
