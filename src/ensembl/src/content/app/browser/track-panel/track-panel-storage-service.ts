import storageService, {
  StorageServiceInterface
} from 'src/services/storage-service';
import { PreviouslyViewedObject } from './trackPanelState';

export enum StorageKeys {
  BOOKMARKS = 'trackPanel.bookmarks',
  PREVIOUSLY_VIEWED = 'trackPanel.previouslyViewedObjects'
}

export class TrackPanelStorageService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getBookmarks(): { [genomeId: string]: PreviouslyViewedObject[] } {
    return this.storageService.get(StorageKeys.BOOKMARKS) || {};
  }

  public updateActiveGenomeBookmarks(activeGenomeBookmarks: {
    [genomeId: string]: PreviouslyViewedObject[];
  }) {
    this.storageService.update(StorageKeys.BOOKMARKS, activeGenomeBookmarks);
  }

  public getPreviouslyViewedObjects(): {
    [genomeId: string]: PreviouslyViewedObject[];
  } {
    return this.storageService.get(StorageKeys.PREVIOUSLY_VIEWED) || {};
  }

  public updatePreviouslyViewedObjects(activeGenomePreviouslyViewedObjects: {
    [genomeId: string]: PreviouslyViewedObject[];
  }) {
    this.storageService.update(
      StorageKeys.PREVIOUSLY_VIEWED,
      activeGenomePreviouslyViewedObjects
    );
  }
}

export default new TrackPanelStorageService(storageService);
