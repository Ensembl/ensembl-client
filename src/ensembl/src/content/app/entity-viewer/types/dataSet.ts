export enum DataSetType {
  CURRENT_ASSEMBLY = 'Current assembly',
  GENE = 'Gene',
  PROTEIN = 'Protein'
}

export type DataSet = {
  type: DataSetType;
  value: string;
};
