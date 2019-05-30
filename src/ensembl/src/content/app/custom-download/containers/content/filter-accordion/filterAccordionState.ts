export type FilterAccordionState = Readonly<{
  expandedPanel: string;
  expandedGenePanels: any;
  filters: any;
}>;

export const defaultFilterAccordionState: FilterAccordionState = {
  expandedPanel: '',
  expandedGenePanels: [],
  filters: {
    source: [],
    gencode_basic_annotation: ''
  }
};
