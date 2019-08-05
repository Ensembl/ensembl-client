import { PrivacyBannerService, PrivacyConfig } from './privacy-banner-service';
import faker from 'faker';

const mockStorageService = {
  get: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
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
        .mockImplementation(() => PrivacyConfig.version);

      const privacyBannerService = new PrivacyBannerService(mockStorageService);
      const result = privacyBannerService.getPolicyVersion();

      expect(mockStorageService.get).toHaveBeenCalledWith(PrivacyConfig.name);
      expect(result).toEqual(PrivacyConfig.version);
    });
  });

  describe('.setPolicyVersion', () => {
    it('saves current privacy policy version to local storage', () => {
      const privacyBannerService = new PrivacyBannerService(mockStorageService);
      privacyBannerService.setPolicyVersion();
      expect(mockStorageService.save).toHaveBeenCalledWith(
        PrivacyConfig.name,
        PrivacyConfig.version
      );
    });
  });

  describe('.shouldShowBanner', () => {
    it('shows banner if privacy version in local storage is different from config version', () => {
      const privacyBannerService = new PrivacyBannerService(mockStorageService);
      const mockVersion = faker.lorem.word();
      jest
        .spyOn(privacyBannerService, 'getPolicyVersion')
        .mockImplementation(() => mockVersion);

      const result = privacyBannerService.shouldShowBanner();
      expect(result).toEqual(true);
    });

    it('does not show banner if privacy version in local storage is same as config version', () => {
      const privacyBannerService = new PrivacyBannerService(mockStorageService);
      jest
        .spyOn(privacyBannerService, 'getPolicyVersion')
        .mockImplementation(() => PrivacyConfig.version);

      const result = privacyBannerService.shouldShowBanner();
      expect(result).toEqual(false);
    });
  });
});
