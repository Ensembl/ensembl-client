import storageService, {
  StorageServiceInterface
} from 'src/services/storage-service';

import { Attributes } from 'src/content/app/custom-download/types/Attributes';
import { Filters } from 'src/content/app/custom-download/types/Filters';

export enum StorageKeys {
  FILTERS = 'customDownload.filtersAccordion.filters',
  SELECTED_FILTERS = 'customDownload.filtersAccordion.selectedFilters',
  FILTERS_CONTENT_STATE = 'customDownload.filtersAccordion.contentState',

  ATTRIBUTES = 'customDownload.attributesAccordion.attributes',
  SELECTED_ATTRIBUTES = 'customDownload.attributesAccordion.selectedAttributes',
  ATTRIBUTES_CONTENT_STATE = 'customDownload.attributesAccordion.contentState',

  SELECTED_PRE_FILTER = 'customDownload.preFilter.selectedPreFilter',
  SHOW_PRE_FILTER_PANEL = 'customDownload.preFilter.showPreFilterPanel',
  SELECTED_TAB = 'customDownload.tab.selectedTab',

  SHOW_PREVIEW = 'customDownload.previewDownload.showPreview'
}

export class CustomDownloadStorageService {
  private storageService: StorageServiceInterface;

  public constructor(storageService: StorageServiceInterface) {
    this.storageService = storageService;
  }

  public getFilters(): Filters {
    return this.storageService.get(StorageKeys.FILTERS) || {};
  }

  public saveFilters(filters: any) {
    this.storageService.save(StorageKeys.FILTERS, filters);
  }

  public getSelectedFilters(): Filters {
    return this.storageService.get(StorageKeys.SELECTED_FILTERS) || {};
  }

  public saveSelectedFilters(selectedFilters: any) {
    this.storageService.save(StorageKeys.SELECTED_FILTERS, selectedFilters);
  }

  public getFiltersContentState(): Filters {
    return this.storageService.get(StorageKeys.FILTERS_CONTENT_STATE) || {};
  }

  public saveFiltersContentState(contentState: any) {
    this.storageService.save(StorageKeys.FILTERS_CONTENT_STATE, contentState);
  }

  public getAttributes(): Attributes {
    return this.storageService.get(StorageKeys.ATTRIBUTES) || {};
  }

  public saveAttributes(attributes: any) {
    this.storageService.save(StorageKeys.ATTRIBUTES, attributes);
  }

  public getSelectedAttributes(): Attributes {
    return this.storageService.get(StorageKeys.SELECTED_ATTRIBUTES) || {};
  }

  public saveSelectedAttributes(selectedAttributes: any) {
    this.storageService.save(
      StorageKeys.SELECTED_ATTRIBUTES,
      selectedAttributes
    );
  }

  public getAttributesContentState(): Attributes {
    return this.storageService.get(StorageKeys.ATTRIBUTES_CONTENT_STATE) || {};
  }

  public saveAttributesContentState(contentState: any) {
    this.storageService.save(
      StorageKeys.ATTRIBUTES_CONTENT_STATE,
      contentState
    );
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
