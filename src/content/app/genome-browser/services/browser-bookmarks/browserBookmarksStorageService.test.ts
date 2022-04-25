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

import {
  BrowserBookmarksStorageService,
  StorageKeys
} from './browserBookmarksStorageService';

const mockStorageService = {
  get: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  removeAt: jest.fn(),
  clearAll: jest.fn()
};

const bookmarks = { foo: [] };

describe('BrowserBookmarksStorageService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('.getBookmarks()', () => {
    it('gets saved bookmarks from storage service', () => {
      jest.spyOn(mockStorageService, 'get').mockImplementation(() => bookmarks);

      const browserBookmarksStorageService = new BrowserBookmarksStorageService(
        mockStorageService
      );

      const result = browserBookmarksStorageService.getBookmarks();

      expect(mockStorageService.get).toHaveBeenCalledWith(
        StorageKeys.BOOKMARKS
      );
      expect(result).toEqual(bookmarks);

      mockStorageService.get.mockRestore();
    });

    it('returns an empty object if there are no saved bookmarks', () => {
      jest.spyOn(mockStorageService, 'get').mockImplementation(() => null);

      const browserSidebarModalStorageService =
        new BrowserBookmarksStorageService(mockStorageService);
      const result = browserSidebarModalStorageService.getBookmarks();

      expect(result).toEqual({});

      mockStorageService.get.mockRestore();
    });
  });

  describe('.updateActiveGenomeBookmarks()', () => {
    it('updates active genome bookmarks via storage service', () => {
      const browserBookmarksStorageService = new BrowserBookmarksStorageService(
        mockStorageService
      );

      const updatedBookmarks = { bar: [] };

      browserBookmarksStorageService.updateBookmarks(updatedBookmarks);

      expect(mockStorageService.update).toHaveBeenCalledWith(
        StorageKeys.BOOKMARKS,
        updatedBookmarks
      );
    });
  });
});
