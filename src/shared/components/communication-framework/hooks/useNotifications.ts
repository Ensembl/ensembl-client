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

import { useState, useEffect } from 'react';

import {
  saveNotification,
  getAllNotifications
} from 'src/shared/services/notificationsStorageService';

/**
 * Suppose the client somehow (via hard-coding at first) receives a list of notifications
 * of the following shape:
 *
 * {
 *   id: string;
 *   important: boolean;
 * }
 *
 * Probably in the future, they will also have a `body` field containing an html string.
 *
 * We will need to store the client-side status of the notifications
 * (e.g. which of them user has seen/dismissed); probably by storing information about them
 * in IndexedDB. For example, the stored notification data may have the following shape:
 *
 * {
 *   id: string;
 *   seen: boolean;
 *   dismissed: boolean;
 *   savedAt: Date;
 * }
 *
 * Designs are currently suggesting that there should be a difference between
 * just having seen a notification (in which case it remains visible in the communication panel,
 * although it should no longer cause the panel to automatically open), and dismissing it entirely
 * (in which case it is no longer visible anywhere in the UI).
 *
 * New notifications will need to show up in the UI. The purpose of this hook
 * is to prepare data for that.
 */

// Consider: does it need a date?
export type IncomingNotification = {
  id: string;
  important: boolean;
};

const useNotifications = () => {
  const [notifications, setNotifications] = useState<IncomingNotification[]>(
    []
  );

  useEffect(() => {
    // - look up saved notifications in indexedDB
    // - perhaps also delete outdated notifications from IndexedDB
    //   (e.g. those whose ids are no longer among incoming notifications)?

    getAllNotifications().then((storedNotifications) => {
      // if notifications have already been set (double run of useEffect with strict mode in dev),
      // then there is nothing else to do
      if (notifications.length) {
        return;
      }

      const selectedNotifications: IncomingNotification[] = [];

      for (const incomingNotification of incomingNotifications) {
        const storedNotification = storedNotifications.find(
          (notification) => notification.id === incomingNotification.id
        );
        if (!storedNotification) {
          selectedNotifications.push(incomingNotification);
        } else if (storedNotification.dismissed) {
          continue;
        } else {
          selectedNotifications.push({
            ...incomingNotification,
            important: false
          });
        }
      }

      // sort important messages first
      selectedNotifications.sort(
        (a, b) => Number(b.important) - Number(a.important)
      );

      setNotifications(selectedNotifications);
    });
  }, []);

  const markNotificationAsSeen = async (id: string) => {
    // store / update notification data in IndexedDB
    await saveNotification({
      id,
      seen: true,
      dismissed: false,
      savedAt: Date.now()
    });
  };

  const dismissNotification = async (id: string) => {
    await saveNotification({
      id,
      seen: true,
      dismissed: true,
      savedAt: Date.now()
    });

    removeNotificationFromState(id);
  };

  const removeNotificationFromState = (id: string) => {
    setNotifications((notifications) =>
      notifications.filter((notification) => notification.id !== id)
    );
  };

  return {
    notifications,
    markNotificationAsSeen,
    dismissNotification
  };
};

// Hard-coded list of notifications
const incomingNotifications: IncomingNotification[] = [
  {
    id: 'beta-intro-rapid-retirement',
    important: true
  }
];

export default useNotifications;
