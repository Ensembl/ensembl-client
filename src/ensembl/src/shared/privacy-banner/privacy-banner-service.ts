import privacyConfig from './privacyConfig';
import storageService, {
  StorageServiceInterface
} from 'src/services/storage-service';

export class PrivacyBannerService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getPolicyVersion(): string {
    return this.storageService.get(privacyConfig.name);
  }

  public setPolicyVersion() {
    this.storageService.save(privacyConfig.name, privacyConfig.version);
  }

  public shouldShowBanner(): boolean {
    return this.getPolicyVersion() !== privacyConfig.version;
  }
}

export default new PrivacyBannerService(storageService);
