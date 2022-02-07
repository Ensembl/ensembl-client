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

import React, { useState } from 'react';
import classNames from 'classnames';

import Modal from 'src/shared/components/modal/Modal';
import HelpPopupBody from './HelpPopupBody';

import { ReactComponent as HelpIcon } from 'static/icons/icon_question.svg';

import styles from './HelpPopupButton.scss';

type Props = {
  labelClass?: string;
  label: string;
  slug: string;
};

const HelpPopupButton = (props: Props) => {
  const [shouldShowModal, setShouldShowModal] = useState(false);

  const openModal = () => {
    setShouldShowModal(true);
  };

  const closeModal = () => {
    setShouldShowModal(false);
  };

  const labelClasses = classNames(styles.label, props.labelClass);

  return (
    <>
      <div className={styles.wrapper} onClick={openModal}>
        <span className={labelClasses}>{props.label}</span>
        <div className={styles.button}>
          <HelpIcon className={styles.icon} />
        </div>
      </div>
      {shouldShowModal && (
        <Modal classNames={{ body: styles.helpPopup }} onClose={closeModal}>
          <HelpPopupBody slug={props.slug} />
        </Modal>
      )}
    </>
  );
};

HelpPopupButton.defaultProps = {
  label: 'Help'
};

export default HelpPopupButton;
