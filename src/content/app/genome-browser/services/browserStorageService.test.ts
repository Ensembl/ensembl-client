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

import { BrowserStorageService, StorageKeys } from './browserStorageService';

const mockStorageService = {
  get: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  removeAt: jest.fn(),
  clearAll: jest.fn()
};

describe('BrowserStorageService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('.getTrackPanels()', () => {
    it('gets saved track panels configuration from storage service', () => {
      const mockTrackPanels = { foo: 'doesnt really matter' };
      jest
        .spyOn(mockStorageService, 'get')
        .mockImplementation(() => mockTrackPanels);

      const browserStorageService = new BrowserStorageService(
        mockStorageService
      );

      const result = browserStorageService.getTrackPanels();

      expect(mockStorageService.get).toHaveBeenCalledWith(
        StorageKeys.TRACK_PANELS
      );
      expect(result).toEqual(mockTrackPanels);

      mockStorageService.get.mockRestore();
    });

    it('returns an empty object if there are no saved track panel configurations', () => {
      jest.spyOn(mockStorageService, 'get').mockImplementation(() => null);

      const browserStorageService = new BrowserStorageService(
        mockStorageService
      );
      const result = browserStorageService.getTrackPanels();

      expect(result).toEqual({});

      mockStorageService.get.mockRestore();
    });
  });

  describe('.updateTrackPanels()', () => {
    it('updates stored track panel configurations', () => {
      const mockTrackPanels = { foo: {} };
      const browserStorageService = new BrowserStorageService(
        mockStorageService
      );

      browserStorageService.updateTrackPanels(mockTrackPanels);

      expect(mockStorageService.update).toHaveBeenCalledWith(
        StorageKeys.TRACK_PANELS,
        mockTrackPanels
      );
    });
  });
});
