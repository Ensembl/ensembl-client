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

import { VEP_SUBMISSIONS_STORE_NAME } from 'src/content/app/tools/vep/services/vepStorageServiceConstants';

import type { IDBPTransaction } from 'idb';

export const migrateVepStore = ({
  oldVersion,
  transaction
}: {
  oldVersion: number;
  transaction: IDBPTransaction<unknown, string[], 'versionchange'>;
}) => {
  if (oldVersion <= 9) {
    clearVepSubmissions({ transaction });
  }
};

const clearVepSubmissions = async ({
  transaction
}: {
  transaction: IDBPTransaction<unknown, string[], 'versionchange'>;
}) => {
  // use the 'versionchange' transaction to access VEP submissions store
  const vepSubmissionsStore = transaction.objectStore(
    VEP_SUBMISSIONS_STORE_NAME
  );
  await vepSubmissionsStore.clear();
};
