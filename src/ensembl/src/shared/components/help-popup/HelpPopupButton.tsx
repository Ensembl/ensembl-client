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

import { isEnvironment, Environment } from 'src/shared/helpers/environment';

import Modal from 'src/shared/components/modal/Modal';
import HelpPopupBody from './HelpPopupBody';
import { HelpAndDocumentation } from 'src/shared/components/app-bar/AppBar';

import { ReactComponent as HelpIcon } from 'static/img/launchbar/help.svg';

import styles from './HelpPopupButton.scss';

type Props = {
  labelClass?: string;
  text: string;
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

  if (isEnvironment([Environment.PRODUCTION])) {
    return <HelpAndDocumentation />;
  }

  const labelClasses = classNames(styles.label, props.labelClass);

  return (
    <>
      <div className={styles.wrapper} onClick={openModal}>
        <span className={labelClasses}>{props.text}</span>
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
  text: 'Help'
};

export default HelpPopupButton;
