import storageService, {
  StorageServiceInterface,
  StorageType
} from 'src/services/storage-service';

import JSONValue from 'src/shared/types/JSON';
import { CustomDownloadActiveConfigurations } from '../state/customDownloadState';

export enum StorageKeys {
  ACTIVE_GENOME_ID = 'customDownload.activeGenomeId',
  ACTIVE_CONFIGURATIONS = 'customDownload.activeConfigurations',
  FILTERS = 'customDownload.filtersAccordion.filters',
  SELECTED_FILTERS = 'customDownload.filtersAccordion.selectedFilters',
  FILTERS_UI = 'customDownload.filtersAccordion.uiState',

  ATTRIBUTES = 'customDownload.attributes.attributes',
  SELECTED_ATTRIBUTES = 'customDownload.attributes.selectedAttributes',
  ATTRIBUTES_UI = 'customDownload.attributes.uiState',

  SELECTED_PRE_FILTER = 'customDownload.preFilter.selectedPreFilter',
  SHOW_PRE_FILTER_PANEL = 'customDownload.preFilter.showPreFilterPanel',

  SHOW_PREVIEW = 'customDownload.previewDownload.showSummary'
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

  // TODO: Remove any
  public updateActiveConfigurationsForGenome(activeConfigurations: any): void {
    this.storageService.update(
      StorageKeys.ACTIVE_CONFIGURATIONS,
      activeConfigurations,
      options
    );
  }

  public getFilters(): JSONValue {
    return this.storageService.get(StorageKeys.FILTERS, options) || {};
  }

  public saveFilters(filters: JSONValue) {
    this.storageService.save(StorageKeys.FILTERS, filters, options);
  }

  public getSelectedFilters(): JSONValue {
    return this.storageService.get(StorageKeys.SELECTED_FILTERS, options) || {};
  }

  public saveSelectedFilters(selectedFilters: JSONValue) {
    this.storageService.save(
      StorageKeys.SELECTED_FILTERS,
      selectedFilters,
      options
    );
  }

  public getFiltersUi(): JSONValue {
    return this.storageService.get(StorageKeys.FILTERS_UI, options) || {};
  }

  public saveFiltersUi(uiState: JSONValue) {
    this.storageService.save(StorageKeys.FILTERS_UI, uiState, options);
  }

  public getAttributes(): JSONValue {
    return this.storageService.get(StorageKeys.ATTRIBUTES, options) || {};
  }

  public saveAttributes(attributes: JSONValue) {
    this.storageService.save(StorageKeys.ATTRIBUTES, attributes, options);
  }

  public getSelectedAttributes(): JSONValue {
    return (
      this.storageService.get(StorageKeys.SELECTED_ATTRIBUTES, options) || {}
    );
  }

  public saveSelectedAttributes(selectedAttributes: JSONValue) {
    this.storageService.save(
      StorageKeys.SELECTED_ATTRIBUTES,
      selectedAttributes,
      options
    );
  }

  public getAttributesUi(): JSONValue {
    return this.storageService.get(StorageKeys.ATTRIBUTES_UI, options) || {};
  }

  public saveAttributesUi(uiState: JSONValue) {
    this.storageService.save(StorageKeys.ATTRIBUTES_UI, uiState, options);
  }

  public getSelectedPreFilter(): string {
    return this.storageService.get(StorageKeys.SELECTED_PRE_FILTER, options);
  }

  public saveSelectedPreFilter(preFilter: string) {
    this.storageService.save(
      StorageKeys.SELECTED_PRE_FILTER,
      preFilter,
      options
    );
  }

  public getShowPreFilterPanel(): boolean {
    return this.storageService.get(StorageKeys.SHOW_PRE_FILTER_PANEL, options);
  }

  public saveShowPreFilterPanel(shouldShowPreFilterPanel: boolean) {
    this.storageService.save(
      StorageKeys.SHOW_PRE_FILTER_PANEL,
      shouldShowPreFilterPanel,
      options
    );
  }

  public getShowPreview(): boolean {
    return this.storageService.get(StorageKeys.SHOW_PREVIEW, options) || false;
  }

  public saveShowPreview(shouldShowPreview: boolean) {
    this.storageService.save(
      StorageKeys.SHOW_PREVIEW,
      shouldShowPreview,
      options
    );
  }
}

export default new CustomDownloadStorageService(storageService);
