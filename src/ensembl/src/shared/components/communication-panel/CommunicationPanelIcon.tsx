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

import { toggleCommunicationPanel } from 'ensemblRoot/src/global/globalActions';
import { ReactComponent as ConversationIcon } from 'static/img/shared/icon_conversation.svg';

import { Environment, isEnvironment } from 'src/shared/helpers/environment';

import styles from './CommunicationPanelIcon.scss';

const CommunicationPanelIcon = () => {
  const dispatch = useDispatch();

  if (isEnvironment([Environment.PRODUCTION])) {
    return null;
  }

  const onClick = () => {
    dispatch(toggleCommunicationPanel());
  };
  return (
    <ConversationIcon onClick={onClick} className={styles.conversationIcon} />
  );
};

export default CommunicationPanelIcon;
