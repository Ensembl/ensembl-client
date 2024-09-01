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

import { useEffect } from 'react';

import BetaIntroRapidRetirement from './beta-intro-rapid-retirement/BetaIntroRapidRetirement';

import type { IncomingNotification } from '../hooks/useNotifications';

import styles from './Notification.module.css';

/**
 * want callbacks to:
 * - mark notification as seen
 * - ignore notification in the future
 */
type Props = {
  notification: IncomingNotification;
  onClose: () => void;
  onNotificationSeen: (id: string) => void;
  onNotificationDismissed: (id: string) => void;
};

/**
 * So far, there is only one hard-coded notification that we can display.
 */

const Notification = (props: Props) => {
  const { notification } = props;

  useEffect(() => {
    props.onNotificationSeen(notification.id);
  });

  const onNotificationDismissed = () => {
    props.onNotificationDismissed(notification.id);
    props.onClose();
  };

  return (
    <div className={styles.container}>
      <BetaIntroRapidRetirement
        onClose={props.onClose}
        onNotificationDismissed={onNotificationDismissed}
      />
    </div>
  );
};

export default Notification;
