import {
  GenomeInfoData,
  GenomeTrackCategories,
  GenomeKaryotypeItem
} from './genomeTypes';

export type GenomeInfoState = Readonly<{
  genomeInfoData: GenomeInfoData;
  genomeInfoFetchFailed: boolean;
  genomeInfoFetching: boolean;
}>;

export const defaultGenomeInfoState: GenomeInfoState = {
  genomeInfoData: {},
  genomeInfoFetchFailed: false,
  genomeInfoFetching: false
};

export type GenomeTrackCategoriesState = Readonly<{
  genomeTrackCategoriesData: GenomeTrackCategories;
  genomeTrackCategoriesFetchFailed: boolean;
  genomeTrackCategoriesFetching: boolean;
}>;

export const defaultGenomeTrackCategoriesState: GenomeTrackCategoriesState = {
  genomeTrackCategoriesData: {},
  genomeTrackCategoriesFetchFailed: false,
  genomeTrackCategoriesFetching: false
};

export type GenomeKaryotypeState = Readonly<{
  genomeKaryotypeData: {
    [genomeId: string]: GenomeKaryotypeItem[];
  };
  genomeKaryotypeFetchFailed: boolean;
  genomeKaryotypeFetching: boolean;
}>;

export const defaultGenomeKaryotypeState: GenomeKaryotypeState = {
  genomeKaryotypeData: {},
  genomeKaryotypeFetchFailed: false,
  genomeKaryotypeFetching: false
};
