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

import IndexedDB from 'src/services/indexeddb-service';

import { NOTIFICATIONS_STORE_NAME as STORE_NAME } from './notificationsStorageConstants';

export type StoredNotification = {
  id: string;
  seen: boolean;
  dismissed: boolean;
  savedAt: number;
};

export const saveNotification = async (notification: StoredNotification) => {
  const notificationId = notification.id;
  await IndexedDB.set(STORE_NAME, notificationId, notification);
};

export const getNotification = async (
  notificationId: string
): Promise<StoredNotification | undefined> => {
  return await IndexedDB.get(STORE_NAME, notificationId);
};

export const getAllNotifications = async (): Promise<StoredNotification[]> => {
  const db = await IndexedDB.getDB();
  return await db.getAll(STORE_NAME);
};

export const updateNotification = async (
  notificationId: string,
  fragment: Partial<StoredNotification>
) => {
  const storedNotification = await getNotification(notificationId);

  if (!storedNotification) {
    return;
  }

  const updatedNotification = {
    ...storedNotification,
    ...fragment
  };

  await saveNotification(updatedNotification);
};

export const deleteNotification = async (notificationId: string) => {
  await IndexedDB.delete(STORE_NAME, notificationId);
};
