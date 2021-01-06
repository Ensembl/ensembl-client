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
  StorageServiceInterface
} from 'src/services/storage-service';
import { PreviouslyViewedObject } from './trackPanelState';

export enum StorageKeys {
  BOOKMARKS = 'trackPanel.bookmarks',
  PREVIOUSLY_VIEWED = 'trackPanel.previouslyViewedObjects'
}

export class TrackPanelStorageService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getBookmarks(): { [genomeId: string]: PreviouslyViewedObject[] } {
    return this.storageService.get(StorageKeys.BOOKMARKS) || {};
  }

  public updateActiveGenomeBookmarks(activeGenomeBookmarks: {
    [genomeId: string]: PreviouslyViewedObject[];
  }) {
    this.storageService.update(StorageKeys.BOOKMARKS, activeGenomeBookmarks);
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
  }
}

export default new TrackPanelStorageService(storageService);
