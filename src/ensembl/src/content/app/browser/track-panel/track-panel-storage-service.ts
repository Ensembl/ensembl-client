import storageService, {
  StorageServiceInterface
} from 'src/services/storage-service';
import { Bookmark } from './trackPanelState';

export enum StorageKeys {
  BOOKMARKS = 'trackPanel.bookmarks'
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
}

export default new TrackPanelStorageService(storageService);
