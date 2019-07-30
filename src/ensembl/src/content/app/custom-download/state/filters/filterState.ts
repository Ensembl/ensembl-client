import Attributes from 'src/content/app/custom-download/types/Attributes';
import JSONValue from 'src/shared/types/JSON';
import customDownloadStorageService from 'src/content/app/custom-download/services/custom-download-storage-service';

export type FilterAccordionState = Readonly<{
  expandedPanel: string;
  filters: Attributes;
  selectedFilters: JSONValue;
  contentState: JSONValue;
}>;

export const defaultFilterAccordionState: FilterAccordionState = {
  expandedPanel: '',
  filters: {},
  selectedFilters: customDownloadStorageService.getSelectedFilters(),
  contentState: {}
};
