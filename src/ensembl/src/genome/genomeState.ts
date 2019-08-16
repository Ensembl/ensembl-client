import {
  GenomeInfoData,
  GenomeTrackCategories,
  GenomeKaryotype
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

export type GenomeKaryotypesState = Readonly<{
  genomeKaryotypesData: {
    [genomeId: string]: GenomeKaryotype[];
  };
  genomeKaryotypesFetchFailed: boolean;
  genomeKaryotypesFetching: boolean;
}>;

export const defaultGenomeKaryotypesState: GenomeKaryotypesState = {
  genomeKaryotypesData: {},
  genomeKaryotypesFetchFailed: false,
  genomeKaryotypesFetching: false
};
