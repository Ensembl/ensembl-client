import storageService, {
  StorageServiceInterface
} from 'src/services/storage-service';
import { Bookmark } from './trackPanelState';

export enum StorageKeys {
  BOOKMARKS = 'trackPanel.bookmarks',
  PREVIOUSLY_VIEWED = 'trackPanel.previouslyViewedObjects'
}

export class TrackPanelStorageService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getBookmarks(): { [genomeId: string]: Bookmark[] } {
    return this.storageService.get(StorageKeys.BOOKMARKS) || {};
  }

  public updateActiveGenomeBookmarks(activeGenomeBookmarks: {
    [genomeId: string]: Bookmark[];
  }) {
    this.storageService.update(StorageKeys.BOOKMARKS, activeGenomeBookmarks);
  }

  public getPreviouslyViewedObjects(): { [genomeId: string]: Bookmark[] } {
    return this.storageService.get(StorageKeys.PREVIOUSLY_VIEWED) || {};
  }

  public updatePreviouslyViewedObjects(activeGenomePreviouslyViewedObjects: {
    [genomeId: string]: Bookmark[];
  }) {
    this.storageService.update(
      StorageKeys.PREVIOUSLY_VIEWED,
      activeGenomePreviouslyViewedObjects
    );
  }
}

export default new TrackPanelStorageService(storageService);
