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
  StorageServiceInterface,
  StorageType
} from 'src/services/storage-service';

import { UIState } from 'src/content/app/species/state/general/speciesGeneralSlice';

export enum StorageKeys {
  GENOME_UI_STATE = 'species.genomeUIState'
}

const options = {
  storage: StorageType.SESSION_STORAGE
};

export class SpeciesStorageService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getUIState(): UIState {
    return this.storageService.get(StorageKeys.GENOME_UI_STATE, options) || {};
  }

  public updateUIState(uiState: UIState) {
    this.storageService.update(StorageKeys.GENOME_UI_STATE, uiState, options);
  }
}

export default new SpeciesStorageService(storageService);
