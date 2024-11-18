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

import classNames from 'classnames';

import ConversationImageIcon from 'static/icons/icon_conversation.svg';

import styles from './ConversationIcon.module.css';

type Notification = 'green';

type Props = {
  notification?: Notification;
  className?: string;
};

const ConversationIcon = (props: Props) => {
  const componentClasses = classNames(
    styles.conversationIconWrapper,
    props.className
  );

  const notificationClasses = classNames(
    styles.notification,
    styles.notificationGreen
  );

  return (
    <div className={componentClasses}>
      <ConversationImageIcon className={styles.conversationIcon} />
      {props.notification && <span className={notificationClasses} />}
    </div>
  );
};

export default ConversationIcon;
