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

import { PrivacyBannerService } from './privacy-banner-service';
import privacyConfig from './privacyConfig';
import { faker } from '@faker-js/faker';

const mockStorageService = {
  get: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
  removeAt: jest.fn(),
  clearAll: jest.fn()
};

describe('PrivacyBannerService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  describe('.getPolicyVersion', () => {
    it('gets privacy policy version from storage service', () => {
      jest
        .spyOn(mockStorageService, 'get')
        .mockImplementation(() => privacyConfig.version);

      const privacyBannerService = new PrivacyBannerService(mockStorageService);
      const result = privacyBannerService.getPolicyVersion();

      expect(mockStorageService.get).toHaveBeenCalledWith(privacyConfig.name);
      expect(result).toEqual(privacyConfig.version);
    });
  });

  describe('.setPolicyVersion', () => {
    it('saves current privacy policy version to local storage', () => {
      const privacyBannerService = new PrivacyBannerService(mockStorageService);
      privacyBannerService.setPolicyVersion();
      expect(mockStorageService.save).toHaveBeenCalledWith(
        privacyConfig.name,
        privacyConfig.version
      );
    });
  });

  describe('.shouldShowBanner', () => {
    it('shows banner if privacy version in local storage is different from config version', () => {
      const privacyBannerService = new PrivacyBannerService(mockStorageService);
      const returnDifferentVersion = () => faker.lorem.word();
      jest
        .spyOn(privacyBannerService, 'getPolicyVersion')
        .mockImplementation(returnDifferentVersion);
      const result = privacyBannerService.shouldShowBanner();
      expect(result).toEqual(true);
    });

    it('does not show banner if privacy version in local storage is same as config version', () => {
      const privacyBannerService = new PrivacyBannerService(mockStorageService);
      const returnSameVersion = () => privacyConfig.version;
      jest
        .spyOn(privacyBannerService, 'getPolicyVersion')
        .mockImplementation(returnSameVersion);
      const result = privacyBannerService.shouldShowBanner();
      expect(result).toEqual(false);
    });
  });
});
