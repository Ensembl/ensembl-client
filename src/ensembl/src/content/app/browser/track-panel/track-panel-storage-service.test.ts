import {
  TrackPanelStorageService,
  StorageKeys
} from './track-panel-storage-service';

const mockStorageService = {
  get: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  clearAll: jest.fn()
};

const bookmarks = { foo: [] };

describe('TrackPanelStorageService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('.getBookmarks()', () => {
    it('gets saved bookmarks from storage service', () => {
      jest.spyOn(mockStorageService, 'get').mockImplementation(() => bookmarks);

      const trackPanelStorageService = new TrackPanelStorageService(
        mockStorageService
      );

      const result = trackPanelStorageService.getBookmarks();

      expect(mockStorageService.get).toHaveBeenCalledWith(
        StorageKeys.BOOKMARKS
      );
      expect(result).toEqual(bookmarks);

      mockStorageService.get.mockRestore();
    });

    it('returns an empty object if there are no saved bookmarks', () => {
      jest.spyOn(mockStorageService, 'get').mockImplementation(() => null);

      const trackPanelStorageService = new TrackPanelStorageService(
        mockStorageService
      );
      const result = trackPanelStorageService.getBookmarks();

      expect(result).toEqual({});

      mockStorageService.get.mockRestore();
    });
  });

  describe('.updateActiveGenomeBookmarks()', () => {
    it('updates active genome bookmarks via storage service', () => {
      const trackPanelStorageService = new TrackPanelStorageService(
        mockStorageService
      );

      const updatedBookmarks = { bar: [] };

      trackPanelStorageService.updateActiveGenomeBookmarks(updatedBookmarks);

      expect(mockStorageService.update).toHaveBeenCalledWith(
        StorageKeys.BOOKMARKS,
        updatedBookmarks
      );
    });
  });
});
