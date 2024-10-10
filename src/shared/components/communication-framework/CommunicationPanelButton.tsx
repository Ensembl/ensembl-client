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

import { useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from 'src/store';

import useNotifications from './hooks/useNotifications';

import { isCommunicationPanelOpen } from 'src/shared/state/communication/communicationSelector';

import { openCommunicationPanel } from 'src/shared/state/communication/communicationSlice';

import CommunicationPanel from 'src/shared/components/communication-framework/CommunicationPanel';

import ConversationIcon from './ConversationIcon';

import styles from './CommunicationPanelButton.module.css';

type Props = {
  withLabel?: boolean;
};

const CommunicationPanelButton = (props: Props) => {
  const elementRef = useRef<HTMLButtonElement | null>(null);
  const { notifications, markNotificationAsSeen, dismissNotification } =
    useNotifications();
  const showCommunicationPanel = useAppSelector(isCommunicationPanelOpen);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // automatically open communication panel if there is an important notification
    if (notifications.some((notification) => notification.important)) {
      dispatch(openCommunicationPanel());
    }
  }, [notifications]);

  const onClick = () => {
    dispatch(openCommunicationPanel());
    trackButtonClick();
  };

  // dispatches an event that the conversation button has been clicked; used for analytics purposes
  const trackButtonClick = () => {
    const event = new CustomEvent('analytics', {
      detail: {
        category: 'communication_panel',
        action: 'opened'
      },
      bubbles: true
    });

    elementRef.current?.dispatchEvent(event);
  };

  return (
    <>
      {showCommunicationPanel && (
        <CommunicationPanel
          notifications={notifications}
          onNotificationSeen={markNotificationAsSeen}
          onNotificationDismissed={dismissNotification}
        />
      )}
      <button
        className={styles.communicationPanelButton}
        onClick={onClick}
        ref={elementRef}
      >
        {props.withLabel && 'Contact us'}
        <ConversationIcon
          notification={notifications.length ? 'green' : undefined}
        />
      </button>
    </>
  );
};

export default CommunicationPanelButton;
