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
import {
  BrowserTrackStates,
  GenomeTrackStates
} from '../components/track-panel/trackPanelConfig';

import { ChrLocation } from 'src/content/app/genome-browser/state/browser-general/browserGeneralSlice';
import {
  TrackPanelState,
  TrackPanelStateForGenome
} from 'src/content/app/genome-browser/state/track-panel/trackPanelSlice';
import {
  BrowserSidebarModalState,
  BrowserSidebarModalStateForGenome
} from '../state/browser-sidebar-modal/browserSidebarModalSlice';

export enum StorageKeys {
  ACTIVE_GENOME_ID = 'browser.activeGenomeId',
  ACTIVE_ENS_OBJECT_ID = 'browser.activeFocusObjectId',
  CHR_LOCATION = 'browser.chrLocation',
  DEFAULT_CHR_LOCATION = 'browser.defaultChrLocation',
  TRACK_STATES = 'browser.trackStates',
  TRACK_PANELS = 'browser.trackPanels',
  SIDEBAR_MODAL = 'browser.sidebarModal'
}

export class BrowserStorageService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getActiveGenomeId(): string | null {
    return this.storageService.get(StorageKeys.ACTIVE_GENOME_ID);
  }

  public saveActiveGenomeId(activeGenomeId: string) {
    this.storageService.save(StorageKeys.ACTIVE_GENOME_ID, activeGenomeId);
  }

  public clearActiveGenomeId() {
    this.storageService.remove(StorageKeys.ACTIVE_GENOME_ID);
  }

  public getActiveFocusObjectIds() {
    return this.storageService.get(StorageKeys.ACTIVE_ENS_OBJECT_ID) || {};
  }

  public updateActiveFocusObjectIds(activeFocusObjectIds: {
    [genomeId: string]: string | undefined;
  }) {
    this.storageService.update(
      StorageKeys.ACTIVE_ENS_OBJECT_ID,
      activeFocusObjectIds
    );
  }

  public getChrLocation() {
    return this.storageService.get(StorageKeys.CHR_LOCATION) || {};
  }

  public updateChrLocation(chrLocation: {
    [genomeId: string]: ChrLocation | undefined;
  }) {
    this.storageService.update(StorageKeys.CHR_LOCATION, chrLocation);
  }

  public getTrackStates(): BrowserTrackStates {
    return this.storageService.get(StorageKeys.TRACK_STATES) || {};
  }

  public saveTrackStates(trackStates: {
    [genomeId: string]: GenomeTrackStates | undefined;
  }) {
    this.storageService.save(StorageKeys.TRACK_STATES, trackStates);
  }

  public getTrackPanels(): { [genomeId: string]: Partial<TrackPanelState> } {
    return this.storageService.get(StorageKeys.TRACK_PANELS) || {};
  }

  public updateTrackPanels(trackPanels: {
    [genomeId: string]: Partial<TrackPanelStateForGenome> | undefined;
  }): void {
    this.storageService.update(StorageKeys.TRACK_PANELS, trackPanels);
  }

  public getBrowserSidebarModals(): {
    [genomeId: string]: Partial<BrowserSidebarModalState>;
  } {
    return this.storageService.get(StorageKeys.SIDEBAR_MODAL) || {};
  }

  public updateBrowserSidebarModals(browserSidebarModals: {
    [genomeId: string]: Partial<BrowserSidebarModalStateForGenome> | undefined;
  }): void {
    this.storageService.update(StorageKeys.SIDEBAR_MODAL, browserSidebarModals);
  }

  public deleteGenome(genomeIdToDelete: string): void {
    const activeGenomeId = this.getActiveGenomeId();
    if (activeGenomeId === genomeIdToDelete) {
      this.clearActiveGenomeId();
    }

    this.updateActiveFocusObjectIds({
      [genomeIdToDelete]: undefined
    });
    this.updateChrLocation({
      [genomeIdToDelete]: undefined
    });
    this.updateTrackPanels({
      [genomeIdToDelete]: undefined
    });
    this.updateBrowserSidebarModals({
      [genomeIdToDelete]: undefined
    });
    this.saveTrackStates({
      [genomeIdToDelete]: undefined
    });
  }
}

export default new BrowserStorageService(storageService);
