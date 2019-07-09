export type FilterAccordionState = Readonly<{
  expandedPanel: string;
  filters: any;
  selectedFilters: any;
}>;

export const defaultFilterAccordionState: FilterAccordionState = {
  expandedPanel: '',
  filters: {},
  selectedFilters: {}
};
