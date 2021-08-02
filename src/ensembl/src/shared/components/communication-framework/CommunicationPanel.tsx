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

import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Overlay from 'src/shared/components/overlay/Overlay';
import CloseButton from 'src/shared/components/close-button/CloseButton';
import ContactUs from './contact-us/ContactUs';

import { toggleCommunicationPanel } from 'src/shared/state/communication/communicationSlice';
import { isCommunicationPanelOpen } from 'src/shared/state/communication/communicationSelector';
import { ReactComponent as ConversationIcon } from 'static/img/shared/icon_conversation.svg';

import styles from './CommunicationPanel.scss';

const CommunicationPanel = () => {
  const showCommunicationPanel = useSelector(isCommunicationPanelOpen);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelWrapperRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (showCommunicationPanel) {
      wrapperRef.current?.addEventListener('wheel', preventScroll, {
        passive: false
      });
    }
  }, [showCommunicationPanel]);

  const onClose = () => {
    dispatch(toggleCommunicationPanel());
  };

  const preventScroll = (e: Event) => {
    const eventTarget = e.target as HTMLElement;
    if (!panelWrapperRef.current?.contains(eventTarget)) {
      // prevent possible window scrolling
      e.preventDefault();
      e.stopPropagation();
    }
  };

  if (!showCommunicationPanel) {
    return null;
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <Overlay className={styles.overlay} />
      <div ref={panelWrapperRef} className={styles.panelWrapper}>
        <div className={styles.panel}>
          <ConversationIcon
            className={styles.conversationIcon}
            onClick={onClose}
          />
          {/* TODO: switch to the proper Tabs component when the tabs become functional */}
          <nav className={styles.panelTabs}>
            <span className={`${styles.tab} ${styles.tabDisabled}`}>
              Messages
            </span>
            <span className={styles.tab}>Contact us</span>
          </nav>
          <CloseButton className={styles.panelCloseButton} onClick={onClose} />
          <div className={styles.panelBody}>
            <ContactUs />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunicationPanel;
