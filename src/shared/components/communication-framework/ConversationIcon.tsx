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

import { useRef } from 'react';
import { useDispatch } from 'react-redux';

import { toggleCommunicationPanel } from 'src/shared/state/communication/communicationSlice';

import CommunicationPanel from 'src/shared/components/communication-framework/CommunicationPanel';

import ConversationImageIcon from 'static/icons/icon_conversation.svg';

import styles from './ConversationIcon.module.css';

type Props = {
  withLabel?: boolean;
};

const ConversationIcon = (props: Props) => {
  const dispatch = useDispatch();
  const elementRef = useRef<HTMLButtonElement | null>(null);

  const onClick = () => {
    dispatch(toggleCommunicationPanel());
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
      <CommunicationPanel />
      <button
        className={styles.communicationPanelToggle}
        onClick={onClick}
        ref={elementRef}
      >
        {props.withLabel && 'Contact us'}
        <ConversationImageIcon className={styles.conversationIcon} />
      </button>
    </>
  );
};

export default ConversationIcon;
