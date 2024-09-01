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

import Notification from './Notification';

import type { IncomingNotification } from '../hooks/useNotifications';

/**
 * want callbacks to:
 * - mark notification as seen
 * - ignore notification in the future
 */
type Props = {
  notifications: IncomingNotification[];
  onClose: () => void;
  onNotificationSeen: (id: string) => void;
  onNotificationDismissed: (id: string) => void;
};

const Notifications = (props: Props) => {
  const { notifications } = props;
  if (!notifications.length) {
    return null;
  }

  /**
   * It seems reasonable to assume that the client
   * may need to deal with multiple notifications;
   * yet, so far, in practice, there can only ever be at most one,
   * and it is not yet clear what our strategy for multiple notifications is going to be.
   */
  const notification = notifications[0];

  return (
    <Notification
      notification={notification}
      onClose={props.onClose}
      onNotificationSeen={props.onNotificationSeen}
      onNotificationDismissed={props.onNotificationDismissed}
    />
  );
};

export default Notifications;
