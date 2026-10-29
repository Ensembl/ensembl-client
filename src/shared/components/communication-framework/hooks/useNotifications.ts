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
import { useLocation } from 'react-router';

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

// Will it make sense to have a date field on the notifications for sorting purposes?
// Also, we will need html body of the message
export type IncomingNotification = {
  id: string;
  important: boolean;
  url_patterns?: string[]; // which pages to show the notification on?
  time_interval?: {
    start?: string; // do not show notification before this time
    end?: string; // stop showing notification after this time
  };
};

const emptyNotifications: IncomingNotification[] = [];

const useNotifications = () => {
  const [notifications, setNotifications] =
    useState<IncomingNotification[]>(emptyNotifications);
  const urlLocation = useLocation();

  useEffect(() => {
    // - look up saved notifications in indexedDB
    // - perhaps also delete outdated notifications from IndexedDB
    //   (e.g. those whose ids are no longer among incoming notifications)?
    getFilteredIncomingNotifications({
      pathname: urlLocation.pathname
    }).then((filteredIncomingNotifications) => {
      const currentNotificationIdsSet = new Set(
        notifications.map(({ id }) => id)
      );
      const incomingNotificationIdsSet = new Set(
        filteredIncomingNotifications.map(({ id }) => id)
      );
      const hasNewNotifications =
        incomingNotificationIdsSet.difference(currentNotificationIdsSet).size >
        0;
      if (hasNewNotifications) {
        setNotifications(filteredIncomingNotifications);
      }
    });
  }, [notifications, urlLocation]);

  const markNotificationAsSeen = async (id: string) => {
    // store / update notification data in IndexedDB
    await saveNotification({
      id,
      seen: true,
      dismissed: false,
      savedAt: getTimestamp()
    });
  };

  const dismissNotification = async (id: string) => {
    await saveNotification({
      id,
      seen: true,
      dismissed: true,
      savedAt: getTimestamp()
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

const getFilteredIncomingNotifications = async ({
  pathname
}: {
  pathname: string;
}) => {
  const storedNotifications = await getAllNotifications();

  const selectedNotifications: IncomingNotification[] = [];

  for (const incomingNotification of incomingNotifications) {
    if (
      shouldIgnoreNotification({
        notification: incomingNotification,
        pathname
      })
    ) {
      continue;
    }

    // has this notification been added to browser storage (i.e. seen by user)?
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

  return selectedNotifications;
};

// Filtering logic for incoming notifications.
// Filters out notifications that have url constraints or time constraints
// if these constraints are not satisfied.
const shouldIgnoreNotification = ({
  notification
}: {
  notification: IncomingNotification;
  pathname: string;
}) => {
  let shouldIgnore = false;

  if (notification.time_interval?.start) {
    const startDate = new Date(notification.time_interval.start);
    const currentTime = Date.now();
    if (currentTime < startDate.getTime()) {
      shouldIgnore = true;
    }
  }

  if (notification.time_interval?.end) {
    const endDate = new Date(notification.time_interval.end);
    const currentTime = Date.now();
    if (currentTime > endDate.getTime()) {
      shouldIgnore = true;
    }
  }

  return shouldIgnore;
};

/**
 * To save new users from the annoyance of seeing multiple notifications,
 *
 */

// Hard-coded list of notifications
const incomingNotifications: IncomingNotification[] = [
  {
    id: 'tools-down-2026-11-03',
    important: true,
    url_patterns: ['/tools'],
    time_interval: {
      end: '2026-11-03T08:00:00+00:00' // start showing the notification until the tools maintenance starts on 8:00 AM, Tuesday, 3rd November 2026
    }
  }
  // {
  //   id: 'first-visit-notification',
  //   important: true
  // }
];

const getTimestamp = () => Date.now();

export default useNotifications;
