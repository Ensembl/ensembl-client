import storageService, {
  StorageServiceInterface
} from 'src/services/storage-service';

import JSONValue from 'src/shared/types/JSON';

export enum StorageKeys {
  FILTERS = 'customDownload.filtersAccordion.filters',
  SELECTED_FILTERS = 'customDownload.filtersAccordion.selectedFilters',
  FILTERS_UI = 'customDownload.filtersAccordion.uiState',

  ATTRIBUTES = 'customDownload.attributes.attributes',
  SELECTED_ATTRIBUTES = 'customDownload.attributes.selectedAttributes',
  ATTRIBUTES_UI = 'customDownload.attributes.uiState',

  SELECTED_PRE_FILTER = 'customDownload.preFilter.selectedPreFilter',
  SHOW_PRE_FILTER_PANEL = 'customDownload.preFilter.showPreFilterPanel',
  SELECTED_TAB = 'customDownload.tab.selectedTab',

  SHOW_PREVIEW = 'customDownload.previewDownload.showSummary'
}

export class CustomDownloadStorageService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getFilters(): JSONValue {
    return this.storageService.get(StorageKeys.FILTERS) || {};
  }

  public saveFilters(filters: JSONValue) {
    this.storageService.save(StorageKeys.FILTERS, filters);
  }

  public getSelectedFilters(): JSONValue {
    return this.storageService.get(StorageKeys.SELECTED_FILTERS) || {};
  }

  public saveSelectedFilters(selectedFilters: JSONValue) {
    this.storageService.save(StorageKeys.SELECTED_FILTERS, selectedFilters);
  }

  public getFiltersUi(): JSONValue {
    return this.storageService.get(StorageKeys.FILTERS_UI) || {};
  }

  public saveFiltersUi(uiState: JSONValue) {
    this.storageService.save(StorageKeys.FILTERS_UI, uiState);
  }

  public getAttributes(): JSONValue {
    return this.storageService.get(StorageKeys.ATTRIBUTES) || {};
  }

  public saveAttributes(attributes: JSONValue) {
    this.storageService.save(StorageKeys.ATTRIBUTES, attributes);
  }

  public getSelectedAttributes(): JSONValue {
    return this.storageService.get(StorageKeys.SELECTED_ATTRIBUTES) || {};
  }

  public saveSelectedAttributes(selectedAttributes: JSONValue) {
    this.storageService.save(
      StorageKeys.SELECTED_ATTRIBUTES,
      selectedAttributes
    );
  }

  public getAttributesUi(): JSONValue {
    return this.storageService.get(StorageKeys.ATTRIBUTES_UI) || {};
  }

  public saveAttributesUi(uiState: JSONValue) {
    this.storageService.save(StorageKeys.ATTRIBUTES_UI, uiState);
  }

  public getSelectedPreFilter(): string {
    return this.storageService.get(StorageKeys.SELECTED_PRE_FILTER);
  }

  public saveSelectedPreFilter(preFilter: string) {
    this.storageService.save(StorageKeys.SELECTED_PRE_FILTER, preFilter);
  }

  public getShowPreFilterPanel(): boolean {
    return this.storageService.get(StorageKeys.SHOW_PRE_FILTER_PANEL);
  }

  public saveShowPreFilterPanel(shouldShowPreFilterPanel: boolean) {
    this.storageService.save(
      StorageKeys.SHOW_PRE_FILTER_PANEL,
      shouldShowPreFilterPanel
    );
  }

  public getSelectedTab(): string {
    return this.storageService.get(StorageKeys.SELECTED_TAB);
  }

  public saveSelectedTab(selectedTab: string) {
    this.storageService.save(StorageKeys.SELECTED_TAB, selectedTab);
  }

  public getShowPreview(): boolean {
    return this.storageService.get(StorageKeys.SHOW_PREVIEW) || false;
  }

  public saveShowPreview(shouldShowPreview: boolean) {
    this.storageService.save(StorageKeys.SHOW_PREVIEW, shouldShowPreview);
  }
}

export default new CustomDownloadStorageService(storageService);
