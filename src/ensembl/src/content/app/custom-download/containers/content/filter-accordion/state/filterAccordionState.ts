import { Filters } from 'src/content/app/custom-download/types/Filters';

export type FilterAccordionState = Readonly<{
  expandedPanel: string;
  filters: Filters;
  selectedFilters: Filters;
  contentState: Filters;
}>;

export const defaultFilterAccordionState: FilterAccordionState = {
  expandedPanel: '',
  filters: {},
  selectedFilters: {},
  contentState: {}
};
