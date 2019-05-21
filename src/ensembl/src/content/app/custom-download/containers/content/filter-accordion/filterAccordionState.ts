export type FilterAccordionState = Readonly<{
  expandedPanel: string;
  expandedGenePanels: any;
  filters: any;
}>;

export const defaultFilterAccordionState: FilterAccordionState = {
  expandedPanel: '',
  expandedGenePanels: [],
  filters: {
    gene_source: [],
    gencode_basic_annotation: ''
  }
};
