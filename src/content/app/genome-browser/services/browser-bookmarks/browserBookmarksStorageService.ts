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

import storageService, {
  type StorageServiceInterface
} from 'src/services/storage-service';

import type { PreviouslyViewedObject } from 'src/content/app/genome-browser/state/browser-bookmarks/browserBookmarksSlice';

export enum StorageKeys {
  USER_BOOKMARKS = 'genomeBrowser.userBookmarks',
  PREVIOUSLY_VIEWED = 'genomeBrowser.previouslyViewedObjects'
}

export class BrowserBookmarksStorageService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  // This is a placeholder function for manual bookmarks saved by users
  public getUserBookmarks(): {
    [genomeId: string]: unknown[];
  } {
    return this.storageService.get(StorageKeys.USER_BOOKMARKS) || {};
  }

  // This is another placeholder function for manual bookmarks saved by users
  public updateUserBookmarks(activeGenomeBookmarks: {
    [genomeId: string]: [] | undefined;
  }) {
    this.storageService.update(
      StorageKeys.USER_BOOKMARKS,
      activeGenomeBookmarks
    );
  }

  public getPreviouslyViewedObjects(): {
    [genomeId: string]: PreviouslyViewedObject[];
  } {
    return this.storageService.get(StorageKeys.PREVIOUSLY_VIEWED) || {};
  }

  public updatePreviouslyViewedObjects(activeGenomePreviouslyViewedObjects: {
    [genomeId: string]: PreviouslyViewedObject[] | undefined;
  }) {
    this.storageService.update(
      StorageKeys.PREVIOUSLY_VIEWED,
      activeGenomePreviouslyViewedObjects
    );
  }

  public deleteGenome(genomeIdToDelete: string): void {
    this.updatePreviouslyViewedObjects({
      [genomeIdToDelete]: undefined
    });
    this.updateUserBookmarks({
      [genomeIdToDelete]: undefined
    });
  }
}

export default new BrowserBookmarksStorageService(storageService);
