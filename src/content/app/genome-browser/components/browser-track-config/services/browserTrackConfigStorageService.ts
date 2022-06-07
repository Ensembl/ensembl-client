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
import type {
  GenomeTrackConfigs,
  TrackConfigsForGenome
} from 'src/content/app/genome-browser/state/track-config/trackConfigSlice';

export enum StorageKeys {
  TRACK_CONFIGS = 'browser.trackConfig'
}

export class TrackConfigStorageService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getTrackConfigs(): GenomeTrackConfigs {
    return this.storageService.get(StorageKeys.TRACK_CONFIGS) || {};
  }

  public setTrackConfigs(params: {
    genomeId: string;
    fragment: Partial<TrackConfigsForGenome> | undefined;
  }) {
    const { genomeId, fragment } = params;
    this.storageService.update(StorageKeys.TRACK_CONFIGS, {
      [genomeId]: fragment
    });
  }

  public deleteTrackConfigs(genomeId: string): void {
    return this.storageService.removeAt(StorageKeys.TRACK_CONFIGS, genomeId);
  }
}

export default new TrackConfigStorageService(storageService);
