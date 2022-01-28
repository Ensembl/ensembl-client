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
import { useDispatch } from 'react-redux';

import useCommonAnalytics from 'src/shared/hooks/useCommonAnalytics';

import { toggleCommunicationPanel } from 'src/shared/state/communication/communicationSlice';
import { ReactComponent as ConversationImageIcon } from 'static/img/shared/icon_conversation.svg';
import CommunicationPanel from 'src/shared/components/communication-framework/CommunicationPanel';

import styles from './ConversationIcon.scss';

type Props = {
  withLabel?: boolean;
};

const ConversationIcon = (props: Props) => {
  const dispatch = useDispatch();

  const { trackContextualHelpOpened } = useCommonAnalytics();

  const onClick = () => {
    trackContextualHelpOpened();

    dispatch(toggleCommunicationPanel());
  };

  return (
    <>
      <CommunicationPanel />
      <div className={styles.conversationIconWrapper} onClick={onClick}>
        {props.withLabel && 'Contact us'}
        <ConversationImageIcon className={styles.conversationIcon} />
      </div>
    </>
  );
};

export default ConversationIcon;
