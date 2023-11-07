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

import type { CommittedItem } from 'src/content/app/species-selector/types/committedItem';

export enum StorageKeys {
  SELECTED_SPECIES = 'speciesSelector.selectedSpecies'
}

// named export is for testing purposes
// for development, use default export
export class SpeciesSelectorStorageService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getSelectedSpecies(): CommittedItem[] {
    return this.storageService.get(StorageKeys.SELECTED_SPECIES) || [];
  }

  public saveSelectedSpecies(species: CommittedItem[]) {
    this.storageService.save(StorageKeys.SELECTED_SPECIES, species);
  }
}

export default new SpeciesSelectorStorageService(storageService);
