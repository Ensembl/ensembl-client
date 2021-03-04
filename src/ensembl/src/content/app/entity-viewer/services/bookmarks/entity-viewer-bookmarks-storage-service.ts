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
import { PreviouslyViewedEntities } from 'src/content/app/entity-viewer/state/bookmarks/entityViewerBookmarksSlice';

export enum StorageKeys {
  BOOKMARKS = 'entityViewer.bookmarks',
  PREVIOUSLY_VIEWED = 'entityViewer.previouslyViewedEntities'
}

export class EntityViewerBookmarksStorageService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getPreviouslyViewedEntities(): PreviouslyViewedEntities {
    return this.storageService.get(StorageKeys.PREVIOUSLY_VIEWED) || {};
  }

  public updatePreviouslyViewedEntities(
    activeGenomePreviouslyViewedEntities: PreviouslyViewedEntities
  ) {
    this.storageService.update(
      StorageKeys.PREVIOUSLY_VIEWED,
      activeGenomePreviouslyViewedEntities
    );
  }
}

export default new EntityViewerBookmarksStorageService(storageService);
