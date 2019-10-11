import storageService, {
  StorageServiceInterface,
  StorageType
} from 'src/services/storage-service';

import {
  CustomDownloadActiveConfigurations,
  CustomDownloadStateForGenome
} from '../state/customDownloadState';

export enum StorageKeys {
  ACTIVE_GENOME_ID = 'customDownload.activeGenomeId',
  ACTIVE_CONFIGURATIONS = 'customDownload.activeConfigurations'
}

const options = {
  storage: StorageType.SESSION_STORAGE
};

export class CustomDownloadStorageService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getActiveGenomeId(): string | null {
    return (
      this.storageService.get(StorageKeys.ACTIVE_GENOME_ID, options) || null
    );
  }

  public saveActiveGenomeId(activeGenomeId: string) {
    this.storageService.save(
      StorageKeys.ACTIVE_GENOME_ID,
      activeGenomeId,
      options
    );
  }

  public getActiveConfigurations(): CustomDownloadActiveConfigurations {
    return (
      this.storageService.get(StorageKeys.ACTIVE_CONFIGURATIONS, options) ||
      null
    );
  }

  // FIXME: Not sure why TypeScript doesn't like it if I use {[key: string]: CustomDownloadStateForGenome} here
  public updateActiveConfigurationsForGenome(activeConfigurations: any): void {
    this.storageService.update(
      StorageKeys.ACTIVE_CONFIGURATIONS,
      activeConfigurations,
      options
    );
  }
}

export default new CustomDownloadStorageService(storageService);
