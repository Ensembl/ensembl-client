import storageService, {
  StorageServiceInterface
} from 'src/services/storage-service';
import { TrackStates } from './track-panel/trackPanelConfig';
import { ImageButtonStatus } from 'src/shared/image-button/ImageButton';

export enum StorageKeys {
  TRACK_STATES = 'browser.trackStates'
}

export class BrowserStorageService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getTrackStates(): TrackStates {
    return this.storageService.get(StorageKeys.TRACK_STATES) || {};
  }

  public saveTrackState(
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
}

export default new BrowserStorageService(storageService);
