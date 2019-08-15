import { Attributes } from 'src/content/app/custom-download/types/Attributes';
import JSONValue from 'src/shared/types/JSON';
import customDownloadStorageService from 'src/content/app/custom-download/services/custom-download-storage-service';

export type FiltersState = Readonly<{
  expandedPanel: string;
  filters: Attributes;
  selectedFilters: JSONValue;
  ui: JSONValue;
}>;

export const defaultFiltersState: FiltersState = {
  expandedPanel: '',
  filters: {},
  selectedFilters: customDownloadStorageService.getSelectedFilters(),
  ui: {}
};
