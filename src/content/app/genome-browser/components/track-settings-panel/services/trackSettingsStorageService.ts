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
  GenomeTrackSettings,
  TrackSettingsForGenome
} from 'src/content/app/genome-browser/state/track-settings/trackSettingsSlice';

export enum StorageKeys {
  TRACK_SETTINGS = 'browser.trackSettings'
}

export class trackSettingsStorageService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getTrackSettings(): GenomeTrackSettings {
    return this.storageService.get(StorageKeys.TRACK_SETTINGS) || {};
  }

  public setTrackSettings(params: {
    genomeId: string;
    fragment: Partial<TrackSettingsForGenome>;
  }) {
    const { genomeId, fragment } = params;
    this.storageService.update(StorageKeys.TRACK_SETTINGS, {
      [genomeId]: fragment
    });
  }

  public deleteTrackSettings(genomeId: string): void {
    return this.storageService.removeAt(StorageKeys.TRACK_SETTINGS, genomeId);
  }
}

export default new trackSettingsStorageService(storageService);
