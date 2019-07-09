export type FilterAccordionState = Readonly<{
  expandedPanel: string;
  expandedGenePanels: string[];
  filters: any;
  selectedFilters: any;
}>;

export const defaultFilterAccordionState: FilterAccordionState = {
  expandedPanel: '',
  expandedGenePanels: [],
  filters: {
    source: [],
    gencode_basic_annotation: ''
  },
  selectedFilters: {}
};
