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
import { useDispatch, useSelector } from 'react-redux';

import Overlay from 'src/shared/components/overlay/Overlay';
import Panel from 'src/shared/components/panel/Panel';

import { toggleContactUs } from 'ensemblRoot/src/global/globalActions';
import { isContactUsOpen } from 'ensemblRoot/src/global/globalSelectors';
import { ReactComponent as ConversationIcon } from 'static/img/shared/icon_conversation.svg';

import styles from './ContactUs.scss';

const ContactUs = () => {
  const showContactUs = useSelector(isContactUsOpen);

  const dispatch = useDispatch();
  if (!showContactUs) {
    return null;
  }

  const onClose = () => {
    dispatch(toggleContactUs());
  };

  return (
    <div className={styles.wrapper}>
      <Overlay className={styles.overlay} onClick={onClose} />
      <div className={styles.panelWrapper}>
        <Panel
          onClose={onClose}
          classNames={{
            closeButton: styles.panelCloseButton,
            panel: styles.panel
          }}
        >
          <div className={styles.panelContent}>
            <div className={styles.conversationIcon}>
              <ConversationIcon />
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default ContactUs;
