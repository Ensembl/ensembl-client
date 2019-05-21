import storageService, {
  StorageServiceInterface
} from 'src/services/storage-service';
import {
  TrackStates,
  TrackType,
  TrackToggleStates
} from './track-panel/trackPanelConfig';
import { ImageButtonStatus } from 'src/shared/image-button/ImageButton';

export enum StorageKeys {
  TRACK_STATES = 'browser.trackStates',
  TRACK_LIST_TOGGLE_STATES = 'browser.trackListToggleStates',
  SELECTED_BROWSER_TAB = 'browser.selectedBrowserTab'
}

export class BrowserStorageService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getTrackStates(): TrackStates {
    return this.storageService.get(StorageKeys.TRACK_STATES) || {};
  }

  public saveTrackStates(
    categoryName: string,
    trackName: string,
    trackStatus: ImageButtonStatus
  ) {
    const trackStates = this.getTrackStates();

    if (!trackStates[categoryName]) {
      trackStates[categoryName] = {};
    }

    trackStates[categoryName][trackName] = trackStatus;

    this.storageService.save(StorageKeys.TRACK_STATES, trackStates);
  }

  public getTrackListToggleStates(): TrackToggleStates {
    return this.storageService.get(StorageKeys.TRACK_LIST_TOGGLE_STATES) || {};
  }

  public updateTrackListToggleStates(toggleState: TrackToggleStates) {
    this.storageService.update(
      StorageKeys.TRACK_LIST_TOGGLE_STATES,
      toggleState
    );
  }

  public getSelectedBrowserTab(): TrackType {
    return (
      this.storageService.get(StorageKeys.SELECTED_BROWSER_TAB) ||
      TrackType.GENOMIC
    );
  }

  public saveSelectedBrowserTab(selectedTab: TrackType) {
    this.storageService.save(StorageKeys.SELECTED_BROWSER_TAB, selectedTab);
  }
}

export default new BrowserStorageService(storageService);
