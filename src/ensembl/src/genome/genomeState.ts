import { GenomeInfoData, GenomeTrackCategory } from './genomeTypes';

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
  genomeTrackCategoriesData: GenomeTrackCategory[];
  genomeTrackCategoriesFetchFailed: boolean;
  genomeTrackCategoriesFetching: boolean;
}>;

export const defaultGenomeTrackCategoriesState: GenomeTrackCategoriesState = {
  genomeTrackCategoriesData: [],
  genomeTrackCategoriesFetchFailed: false,
  genomeTrackCategoriesFetching: false
};
