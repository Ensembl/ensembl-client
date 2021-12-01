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

import { EntityViewerGeneralState } from 'src/content/app/entity-viewer/state/general/entityViewerGeneralSlice';
import storageService, {
  StorageServiceInterface,
  StorageType
} from 'src/services/storage-service';

export enum StorageKeys {
  GENERAL_STATE = 'entityViewer.generalState'
}

const localStorageOptions = {
  storage: StorageType.LOCAL_STORAGE
};

export class EntityViewerStorageService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getGeneralState(): Partial<EntityViewerGeneralState> | null {
    return this.storageService.get(
      StorageKeys.GENERAL_STATE,
      localStorageOptions
    );
  }

  public updateGeneralState(updatedState: Partial<EntityViewerGeneralState>) {
    this.storageService.update(
      StorageKeys.GENERAL_STATE,
      updatedState,
      localStorageOptions
    );
  }

  public deleteGenome(genomeIdToDelete: string): void {
    const activeGenomeId = this.getGeneralState()?.activeGenomeId;
    if (activeGenomeId === genomeIdToDelete) {
      this.updateGeneralState({
        activeGenomeId: undefined
      });
    }
    this.storageService.removeAt(
      StorageKeys.GENERAL_STATE,
      ['activeEntityIds', genomeIdToDelete],
      localStorageOptions
    );
  }
}

export default new EntityViewerStorageService(storageService);
