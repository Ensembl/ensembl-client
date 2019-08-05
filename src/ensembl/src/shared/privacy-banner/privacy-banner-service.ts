import storageService, {
  StorageServiceInterface
} from 'src/services/storage-service';

export const PrivacyConfig = {
  name: 'ensembl_privacy_policy',
  version: '2.0.0',
  policyUrl: 'https://www.ebi.ac.uk/data-protection/ensembl/privacy-notice',
  termsUrl: 'https://www.ebi.ac.uk/about/terms-of-use'
};

export class PrivacyBannerService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getPolicyVersion(): string {
    return this.storageService.get(PrivacyConfig.name);
  }

  public setPolicyVersion() {
    this.storageService.save(PrivacyConfig.name, PrivacyConfig.version);
  }

  // Returns true if versions doesn't match
  public shouldShowBanner(): boolean {
    return this.getPolicyVersion() !== PrivacyConfig.version;
  }
}

export default new PrivacyBannerService(storageService);
