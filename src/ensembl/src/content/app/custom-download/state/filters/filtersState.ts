import { Attributes } from 'src/content/app/custom-download/types/Attributes';
import JSONValue from 'src/shared/types/JSON';

export type FiltersState = Readonly<{
  expandedPanel: string;
  filters: Attributes;
  selectedFilters: JSONValue;
  ui: JSONValue;
}>;

export const defaultFiltersState: FiltersState = {
  expandedPanel: '',
  filters: {},
  selectedFilters: {},
  ui: {}
};
