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

import { useState, useEffect, useRef } from 'react';

import { useAppDispatch } from 'src/store';

import { toggleCommunicationPanel } from 'src/shared/state/communication/communicationSlice';

import { CommunicationPanelContextProvider } from './communicationPanelContext';
import Overlay from 'src/shared/components/overlay/Overlay';
import CloseButton from 'src/shared/components/close-button/CloseButton';
import ContactUs from './contact-us/ContactUs';
import TextButton from 'src/shared/components/text-button/TextButton';
import Notifications from 'src/shared/components/communication-framework/notifications/Notifications';
import ConversationIcon from './ConversationIcon';

import type { IncomingNotification } from './hooks/useNotifications';

import styles from './CommunicationPanel.module.css';

type Props = {
  notifications: IncomingNotification[];
  onNotificationSeen: (id: string) => void;
  onNotificationDismissed: (id: string) => void;
};

type CommunicationPanelView = 'notifications' | 'contact-us';

const CommunicationPanel = (props: Props) => {
  const { notifications } = props;
  const initialView = notifications.length ? 'notifications' : 'contact-us';
  const [view, setView] = useState<CommunicationPanelView>(initialView);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panelWrapperRef = useRef<HTMLDivElement>(null);
  const panelBodyRef = useRef<HTMLDivElement>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    wrapperRef.current?.addEventListener('wheel', preventScroll, {
      passive: false
    });
    return () => {
      wrapperRef.current?.removeEventListener('wheel', preventScroll);
    };
  }, []);

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

  return (
    <CommunicationPanelContextProvider value={{ panelBody: panelBodyRef }}>
      <div className={styles.wrapper} ref={wrapperRef}>
        <Overlay className={styles.overlay} />
        <div ref={panelWrapperRef} className={styles.panelWrapper}>
          <div className={styles.panel}>
            <CommunicationPanelHeader
              notifications={notifications}
              view={view}
              onViewChange={setView}
              onClose={onClose}
            />
            <div className={styles.panelBody} ref={panelBodyRef}>
              {view === 'notifications' ? (
                <Notifications
                  notifications={notifications}
                  onClose={onClose}
                  onNotificationSeen={props.onNotificationSeen}
                  onNotificationDismissed={props.onNotificationDismissed}
                />
              ) : (
                <ContactUs />
              )}
            </div>
          </div>
        </div>
      </div>
    </CommunicationPanelContextProvider>
  );
};

const CommunicationPanelHeader = (props: {
  notifications: Props['notifications'];
  view: CommunicationPanelView;
  onViewChange: (view: CommunicationPanelView) => void;
  onClose: () => void;
}) => {
  const { notifications, onClose } = props;
  const shouldShowNotifications = notifications.length > 0;

  return (
    <div className={styles.panelHeader}>
      <ConversationIcon
        className={styles.conversationIcon}
        notification={shouldShowNotifications ? 'green' : undefined}
      />
      <CommunicationPanelHeaderNav {...props} />
      <CloseButton className={styles.panelCloseButton} onClick={onClose} />
    </div>
  );
};

const CommunicationPanelHeaderNav = ({
  notifications,
  view,
  onViewChange
}: {
  notifications: Props['notifications'];
  view: CommunicationPanelView;
  onViewChange: (view: CommunicationPanelView) => void;
}) => {
  const isNotificationsTabDisabled =
    view === 'contact-us' && !notifications.length;
  const isNotificationsTabActive = view === 'notifications';
  const isContactUsTabActive = view === 'contact-us';

  const notificationsTabStyles = isNotificationsTabActive
    ? styles.tabActive
    : undefined;
  const contactUsTabStyles = isContactUsTabActive
    ? styles.tabActive
    : undefined;

  return (
    <nav className={styles.headerNav}>
      <TextButton
        onClick={() => onViewChange('notifications')}
        disabled={isNotificationsTabDisabled || isNotificationsTabActive}
        className={notificationsTabStyles}
      >
        Messages
      </TextButton>
      <TextButton
        onClick={() => onViewChange('contact-us')}
        disabled={isContactUsTabActive}
        className={contactUsTabStyles}
      >
        Contact us
      </TextButton>
    </nav>
  );
};

export default CommunicationPanel;
