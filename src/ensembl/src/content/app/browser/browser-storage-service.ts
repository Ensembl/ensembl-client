import storageService, {
  StorageServiceInterface
} from 'src/services/storage-service';
import {
  TrackStates,
  TrackSet,
  TrackToggleStates
} from './track-panel/trackPanelConfig';
import { ChrLocations } from './browserState';

export enum StorageKeys {
  ACTIVE_GENOME_ID = 'browser.activeGenomeId',
  ACTIVE_ENS_OBJECT_ID = 'browser.activeEnsObjectId',
  CHR_LOCATION = 'browser.chrLocation',
  DEFAULT_CHR_LOCATION = 'browser.defaultChrLocation',
  TRACK_STATES = 'browser.trackStates',
  TRACK_LIST_TOGGLE_STATES = 'browser.trackListToggleStates',
  SELECTED_TRACK_PANEL_TAB = 'browser.selectedTrackPanelTab'
}

export class BrowserStorageService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getActiveGenomeId(): string {
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

  public getTrackStates(): TrackStates {
    return this.storageService.get(StorageKeys.TRACK_STATES) || {};
  }

  public saveTrackStates(trackStates: TrackStates) {
    this.storageService.save(StorageKeys.TRACK_STATES, trackStates);
  }

  public getTrackListToggleStates() {
    return this.storageService.get(StorageKeys.TRACK_LIST_TOGGLE_STATES) || {};
  }

  public updateTrackListToggleStates(toggleState: {
    [genomeId: string]: TrackToggleStates;
  }) {
    this.storageService.update(
      StorageKeys.TRACK_LIST_TOGGLE_STATES,
      toggleState
    );
  }

  public getSelectedTrackPanelTab(): { [genomeId: string]: TrackSet } {
    return this.storageService.get(StorageKeys.SELECTED_TRACK_PANEL_TAB) || {};
  }

  public updateSelectedTrackPanelTab(selectedTrackPanelTabForGenome: {
    [genomeId: string]: TrackSet;
  }) {
    this.storageService.update(
      StorageKeys.SELECTED_TRACK_PANEL_TAB,
      selectedTrackPanelTabForGenome
    );
  }
}

export default new BrowserStorageService(storageService);
