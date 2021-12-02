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

import {
  CustomDownloadActiveConfigurations,
  CustomDownloadStateForGenome
} from 'src/content/app/custom-download/state/customDownloadState';
import JSONValue from 'src/shared/types/JSON';

export enum StorageKeys {
  ACTIVE_GENOME_ID = 'customDownload.activeGenomeId',
  ACTIVE_CONFIGURATIONS = 'customDownload.activeConfigurations'
}

const options = {
  storage: StorageType.SESSION_STORAGE
};

export class CustomDownloadStorageService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getActiveGenomeId(): string | null {
    return (
      this.storageService.get(StorageKeys.ACTIVE_GENOME_ID, options) || null
    );
  }

  public saveActiveGenomeId(activeGenomeId: string) {
    this.storageService.save(
      StorageKeys.ACTIVE_GENOME_ID,
      activeGenomeId,
      options
    );
  }

  public getActiveConfigurations(): CustomDownloadActiveConfigurations {
    return (
      this.storageService.get(StorageKeys.ACTIVE_CONFIGURATIONS, options) ||
      null
    );
  }

  public updateActiveConfigurationsForGenome(activeConfigurations: {
    [key: string]: CustomDownloadStateForGenome;
  }): void {
    this.storageService.save(
      StorageKeys.ACTIVE_CONFIGURATIONS,
      activeConfigurations as JSONValue,
      options
    );
  }
}

export default new CustomDownloadStorageService(storageService);
