import storageService, {
  StorageServiceInterface
} from 'src/services/storage-service';
import { BrowserTrackStates } from './track-panel/trackPanelConfig';
import { ChrLocations } from './browserState';
import {
  TrackPanelState,
  TrackPanelStateForGenome
} from 'src/content/app/browser/track-panel/trackPanelState';

export enum StorageKeys {
  ACTIVE_GENOME_ID = 'browser.activeGenomeId',
  ACTIVE_ENS_OBJECT_ID = 'browser.activeEnsObjectId',
  CHR_LOCATION = 'browser.chrLocation',
  DEFAULT_CHR_LOCATION = 'browser.defaultChrLocation',
  TRACK_STATES = 'browser.trackStates',
  TRACK_PANELS = 'browser.trackPanels',
  SELECTED_TRACK_PANEL_TAB = 'browser.selectedTrackPanelTab'
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

  public getActiveEnsObjectIds() {
    return this.storageService.get(StorageKeys.ACTIVE_ENS_OBJECT_ID) || {};
  }

  public updateActiveEnsObjectIds(activeEnsObjectIds: {
    [genomeId: string]: string;
  }) {
    this.storageService.update(
      StorageKeys.ACTIVE_ENS_OBJECT_ID,
      activeEnsObjectIds
    );
  }

  public getChrLocation() {
    return this.storageService.get(StorageKeys.CHR_LOCATION) || {};
  }

  public updateChrLocation(chrLocation: ChrLocations) {
    this.storageService.update(StorageKeys.CHR_LOCATION, chrLocation);
  }

  public getTrackStates(): BrowserTrackStates {
    return this.storageService.get(StorageKeys.TRACK_STATES) || {};
  }

  public saveTrackStates(trackStates: BrowserTrackStates) {
    this.storageService.save(StorageKeys.TRACK_STATES, trackStates);
  }

  public getTrackPanels(): { [genomeId: string]: Partial<TrackPanelState> } {
    return this.storageService.get(StorageKeys.TRACK_PANELS) || {};
  }

  public updateTrackPanels(trackPanels: {
    [genomeId: string]: Partial<TrackPanelStateForGenome>;
  }): void {
    this.storageService.update(StorageKeys.TRACK_PANELS, trackPanels);
  }
}

export default new BrowserStorageService(storageService);
